import fs from 'fs';
import * as vscode from 'vscode';

/**
 * ドキュメントを読み取ります。
 * @param doc
 * @param startLen 読み取り開始の行
 * @param endLen 読み取り終了の行
 * @returns
 */
export function documentRead(
  doc: vscode.TextDocument,
  startLen: number = 0,
  endLen: number = doc.lineCount,
): string {
  /** 先頭箇所の取得 */
  const topPos = new vscode.Position(startLen, 0);
  /** 最終箇所の取得 */
  const lastPos = new vscode.Position(endLen, 0);
  /** ポジションを選択する */
  const curSelection = new vscode.Selection(topPos, lastPos);
  /** 全体を取得 */
  const text = doc.getText(curSelection);

  return text;
}

/**
 * ドキュメントに書き込みます。
 * @param edit 書き込むエディタ
 * @param str 書き込む文字列
 * @param startLen 書き込み開始の行
 * @param endLen 書き込み終了の行
 * @returns
 */
export function documentWrite(
  edit: vscode.TextEditor,
  str: string,
  startLen: number = 0,
  endLen: number = edit.document.lineCount,
): void {
  /** 先頭箇所の取得 */
  const topPos = new vscode.Position(startLen, 0);
  /** 最終箇所の取得 */
  const lastPos = new vscode.Position(endLen, 0);
  /** ポジションを選択する */
  const curSelection = new vscode.Selection(topPos, lastPos);

  edit.edit((e) => {
    e.replace(curSelection, str);
  });
}

/**
 * ファイル名から拡張子を取得します。
 * @param fileName
 * @returns 所得成功時：ドット付き拡張子、失敗時：null
 */
export function getFileExtension(fileName: string): string | null {
  const matchedExt = fileName.match(/^(.+?)(\.[^.]+)?$/) ?? [];
  const [, , ext] = matchedExt.map((match) => match ?? '');
  if (ext) {
    return ext;
  } else {
    return null;
  }
}

/**
 * ファイルもしくはディレクトリが存在するかどうかを返します。
 * @param path
 * @returns
 */
export async function existsFileOrDirectory(path: vscode.Uri) {
  try {
    await vscode.workspace.fs.stat(path);
  } catch (error) {
    if (error instanceof Error && error.name === 'EntryNotFound (FileSystemError)') {
      return false;
    }
    throw error;
  }
  return true;
}

/**
 * ハードリンクを作成します。
 * @param src リンク元
 * @param dest リンク先
 */
export function createHardLink(src: string, dest: string): void {
  fs.linkSync(src, dest);
}

/**
 * ファイルをコピーします。
 * @param src コピー元
 * @param dest コピー先
 */
export function copyFile(src: string, dest: string): void {
  vscode.workspace.fs.copy(vscode.Uri.file(src), vscode.Uri.file(dest));
}

/**
 * ディレクトリを作成します。
 * @param dirPath
 * @param isOverwrite 既にディレクトリが存在する場合に上書きするかどうか
 * @returns
 * @throws ディレクトリが存在し、かつ上書きしない場合
 */
export async function createDirectory(dirPath: vscode.Uri, isOverwrite: boolean = false) {
  // ディレクトリが存在するかどうかのチェック
  if (await existsFileOrDirectory(dirPath)) {
    if (!isOverwrite) {
      const e = new Error(`ディレクトリが既に存在します。${dirPath}`);
      e.name = 'DirectoryAlreadyExists';
      throw e;
    }
  }
  await vscode.workspace.fs.createDirectory(dirPath);
}

/**
 * ディレクトリを削除します。
 * @param dirPath
 * @param recursive ディレクトリを再帰的に削除するかどうか
 * @returns
 */
export async function deleteDirectory(dirPath: vscode.Uri, recursive: boolean = true) {
  await vscode.workspace.fs.delete(dirPath, { recursive });
}
