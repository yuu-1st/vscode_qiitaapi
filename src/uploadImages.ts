import { marked } from 'marked';
import path from 'path';
import * as vscode from 'vscode';
import { url } from './constants';
import {
  copyFile,
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
import { getUseCopyInUploadImage } from './object/settingsManagement';

/**
 * 処理を続行するかをユーザーに確認します。
 * @param message 確認メッセージ。「はい」がtrueとなるようなメッセージを指定してください。
 */
async function confirmContinue(message: string): Promise<boolean> {
  const result = await vscode.window.showInformationMessage(message, 'はい', 'いいえ');
  if (result === 'はい') {
    return true;
  }
  return false;
}

/**
 * 複数の連なる画像タグからタグと画像のパスを取得します。
 * @param str 画像タグの連なり
 * @returns syntax: '\!\[alt](url)'; alt: string; url: string の配列
 */
function extractImageStrings(str: string): { syntax: string; alt: string; url: string }[] {
  const regex = /!\[(.*?)\]\((.*?)\)/g;
  const matches = str.matchAll(regex);
  const result: { syntax: string; alt: string; url: string }[] = [];

  for (const match of matches) {
    const [syntax, alt, url] = match;
    result.push({ syntax, alt, url });
  }

  return result;
}

/**
 * tokenのリストから、ローカルパスのトークンを取得します。
 * @param tokens
 */
function getLocalPathTokens(tokens: marked.TokensList): marked.Tokens.Image[] {
  return getImageInfoFromTokens(tokens).filter((image) => {
    return !image.href.match(/^(http|https):\/\//);
  });
}

/**
 * 相対パスで記述されている画像のパスを取得し、アップロードできるようにします。
 * @param isExistNextCode この関数の後に実行されるコードが存在するかどうか
 * @returns 続行できるかどうか
 */
export const uploadImages = async (isExistNextCode: boolean) => {
  // アクティブエディタの取得
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('アクティブエディタが取得できませんでした。');
    return false;
  }
  // アクティブエディタが保存されたファイルかどうかのチェック
  if (editor.document.isUntitled) {
    vscode.window.showErrorMessage('アクティブエディタは保存されていません。');
    return false;
  }

  // アクティブエディタのパスを取得
  const activePath = editor.document.uri;
  console.log(`activePath : ${activePath}`);

  const qiitaPrm = readQiitaParameter(editor.document, true);
  const doc = editor.document;
  const body = documentRead(doc, qiitaPrm._lastRow);

  // 画像一覧を取得
  const token = parseMarkdownToTokens(body);
  // ローカルパスの画像一覧を取得
  const relativeImages = getLocalPathTokens(token);
  // ローカルパスの画像がない場合は終了
  if (relativeImages.length === 0) {
    if (!isExistNextCode) {
      vscode.window.showInformationMessage('アップロードできる画像はありませんでした。');
    }
    return true;
  }
  // 画像存在確認
  const uploadImagesPathList = await Promise.all(
    relativeImages.map(async (image) => {
      // 画像のパスを取得
      const imagePath = (() => {
        if (path.isAbsolute(image.href)) {
          // 絶対パスの場合
          return image.href;
        }
        // 相対パスの場合
        return `${activePath.fsPath.substring(0, activePath.fsPath.lastIndexOf('/'))}/${
          image.href
        }`;
      })();
      // 画像の拡張子を取得
      if (!(await existsFileOrDirectory(vscode.Uri.file(imagePath)))) {
        vscode.window.showErrorMessage(`画像が存在しません。${imagePath}`);
        return null;
      }
      return { imagePath, text: image.text };
    }),
  ).then((pathList) => {
    return pathList.flatMap((path) => (path ? path : []));
  });
  if (uploadImagesPathList.length === 0) {
    if (!isExistNextCode) {
      vscode.window.showInformationMessage('アップロードできる画像はありませんでした。');
    } else {
      return await confirmContinue(
        'アップロードできる画像はありませんでした。そのままqiitaに投稿しますか？',
      );
    }
    return false;
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
      vscode.window.showErrorMessage(
        `「uploadImages」ディレクトリが既に存在するため、中断しました。${uploadImagesDir}`,
      );
      return;
    }
    vscode.window.showErrorMessage(`エラーが発生しました。`);
    throw error;
  }
  // 「uploadImages」ディレクトリに画像をハードリンクする
  Promise.all(
    uploadImagesPathList.map(async (image) => {
      const { imagePath, text } = image;
      // 画像の拡張子を取得
      const imageExt = getFileExtension(imagePath);
      // ハードリンク先のパスを取得
      const uploadImagePath = `${uploadImagesDir.fsPath}/${text}${imageExt}`;
      if (getUseCopyInUploadImage()) {
        // コピーを作成
        copyFile(imagePath, uploadImagePath);
      } else {
        // ハードリンクを作成
        createHardLink(imagePath, uploadImagePath);
      }
      return uploadImagePath;
    }),
  );

  // qiitaの画像アップロードページを開く
  vscode.env.openExternal(vscode.Uri.parse(url.uploadImages));
  // 「uploadImages」ディレクトリを開く
  vscode.env.openExternal(uploadImagesDir);

  // 入力フォームを開く
  const input = await vscode.window.showInputBox({
    prompt: 'アップロードした画像のURLを入力してください。',
    ignoreFocusOut: true,
  });
  console.log(`input : ${input}`);
  if (typeof input === 'undefined') {
    // 「uploadImages」ディレクトリを削除
    deleteDirectory(uploadImagesDir);

    return false;
  }

  // // 入力された文字列から![alt](url)の配列を作成
  const imageList = extractImageStrings(input);

  // 画像のURLを更新(拡張子を除く)
  const updatedToken = updateImageUrl(
    token,
    imageList.map((image) => ({ ...image, alt: image.alt.replace(/\.[^.]+$/, '') })),
  );
  // 更新したTokenからMarkdownを作成
  const updatedMarkdown = parseTokensToMarkdown(updatedToken);
  // Markdownをアクティブエディタに書き込む
  documentWrite(editor, `${createQiitaParameterTemplate(qiitaPrm)}\n${updatedMarkdown}`);

  // 「uploadImages」ディレクトリを削除
  deleteDirectory(uploadImagesDir);

  // isExistNextCodeがtrueの場合
  if (isExistNextCode) {
    // ローカルパスの画像があるか再度確認
    const localImages = getLocalPathTokens(updatedToken);
    if (localImages.length > 0) {
      // 続行するか確認
      return await confirmContinue('ローカルパスの画像が残っていますが、操作を続行しますか？');
    }
  }
  return true;
};
