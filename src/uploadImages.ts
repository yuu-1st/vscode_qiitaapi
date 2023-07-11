import assert from 'assert';
import { execSync } from 'child_process';
import * as vscode from 'vscode';
import { url } from './constants';
import {
  createDirectory,
  createHardLink,
  deleteDirectory,
  documentRead,
  documentWrite,
  existsFileOrDirectory,
  getFileExtension,
} from './object/fileOperating';
import {
  getImageInfoFromTokens,
  parseMarkdownToTokens,
  parseTokensToMarkdown,
  updateImageUrl,
} from './object/markdownOperation';
import { createQiitaParameterTemplate, readQiitaParameter } from './object/qiitaParameter';

/**
 * 相対パスで記述されている画像のパスを取得し、アップロードできるようにします。
 */
export const uploadImages = async () => {
  // アクティブエディタの取得
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('アクティブエディタが取得できませんでした。');
    return;
  }
  // アクティブエディタが保存されたファイルかどうかのチェック
  if (editor.document.isUntitled) {
    vscode.window.showErrorMessage('アクティブエディタは保存されていません。');
    return;
  }

  // アクティブエディタのパスを取得
  const activePath = editor.document.uri;
  console.log(`activePath : ${activePath}`);

  const qiitaPrm = readQiitaParameter(editor, true);
  const doc = editor.document;
  const body = documentRead(doc, qiitaPrm._lastRow);

  // 画像一覧を取得
  const token = parseMarkdownToTokens(body);
  const images = getImageInfoFromTokens(token);
  // ローカルパスの画像一覧を取得
  const relativeImages = images.filter((image) => {
    return !image.href.match(/^(http|https):\/\//);
  });
  // ローカルパスの画像がない場合は終了
  if (relativeImages.length === 0) {
    vscode.window.showInformationMessage('アップロードできる画像はありませんでした。');
    return;
  }
  // 画像存在確認
  const uploadImagesPathList = await Promise.all(
    relativeImages.map(async (image) => {
      // 画像のパスを取得
      const imagePath = `${activePath.fsPath.substring(0, activePath.fsPath.lastIndexOf('/'))}/${
        image.href
      }`;
      // 画像の拡張子を取得
      if (!(await existsFileOrDirectory(vscode.Uri.file(imagePath)))) {
        vscode.window.showErrorMessage(`画像が存在しません。${imagePath}`);
        return null;
      }
      return {imagePath, text: image.text};
    }),
  ).then((pathList) => {
    return pathList.flatMap((path) => (path ? path : []));
  });
  if (uploadImagesPathList.length === 0) {
    vscode.window.showInformationMessage('アップロードできる画像はありませんでした。');
    return;
  }

  // アクティブエディタのディレクトリに「uploadImages」という名前のディレクトリを作成
  const uploadImagesDir = activePath.with({
    path: `${activePath.path.substring(0, activePath.path.lastIndexOf('/'))}/uploadImages`,
  });
  console.log(`uploadImagesDir : ${uploadImagesDir.fsPath}`);
  try {
    await createDirectory(uploadImagesDir);
  } catch (error) {
    if (error instanceof Error && error.name === 'DirectoryAlreadyExists') {
      // 既にディレクトリが存在する場合はエラーを返す
      vscode.window.showErrorMessage(`「uploadImages」ディレクトリが既に存在するため、中断しました。${uploadImagesDir}`);
      return;
    }
    vscode.window.showErrorMessage(`エラーが発生しました。`);
    throw error;
  }
  // 「uploadImages」ディレクトリに画像をハードリンクする
  Promise.all(
    uploadImagesPathList.map(async (image) => {
      const {imagePath, text} = image;
      // 画像の拡張子を取得
      const imageExt = getFileExtension(imagePath);
      // ハードリンク先のパスを取得
      const uploadImagePath = `${uploadImagesDir.fsPath}/${text}${imageExt}`;
      // ハードリンクを作成
      createHardLink(imagePath, uploadImagePath);
      return uploadImagePath;
    }),
  );

  // qiitaの画像アップロードページを開く
  vscode.env.openExternal(vscode.Uri.parse(url.uploadImages));
  // 「uploadImages」ディレクトリを開く
  execSync(`open ${uploadImagesDir.fsPath}`);
  // 入力フォームを開く
  const input = await vscode.window.showInputBox({
    prompt: 'アップロードした画像のURLを入力してください。',
    ignoreFocusOut: true,
  });
  if (!input) {
    return;
  }
  console.log(`input : ${input}`);
  // 入力された文字列から![alt](url)の配列を作成

  function extractImageStrings(str: string): string[] {
    const regex = /!\[.*?\]\(.*?\)/g;
    const matches = str.match(regex);
    return matches ? matches : [];
  }

  const inputImages = extractImageStrings(input);
  console.log(`inputImages : ${inputImages}`);
  // 入力された文字列から画像のURLを取得
  const urlList = inputImages.map((image) => {
    const regex = /!\[(.*?)\]\((.*?)\)/;
    const matches = image.match(regex);
    assert(matches);
    const [, text, href] = matches;
    // textは拡張子を除いた画像名
    return { text: text.replace(/\.[^.]+$/, ''), href };
  });

  // 画像のURLを更新
  const updatedToken = updateImageUrl(token, urlList);
  // 更新したTokenからMarkdownを作成
  const updatedMarkdown = parseTokensToMarkdown(updatedToken);
  // Markdownをアクティブエディタに書き込む
  documentWrite(editor, `${createQiitaParameterTemplate(qiitaPrm)}\n${updatedMarkdown}`);
  // 「uploadImages」ディレクトリを削除
  deleteDirectory(uploadImagesDir);
};
