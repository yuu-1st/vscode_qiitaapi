import * as vscode from 'vscode';

/**
 * コマンドの識別子を変更した時に、前の識別子で実行した際に警告を出してから実行します。
 * @param func 実行する関数
 * @param beforeKey 非推奨となる前の識別子
 * @param afterKey 新しい識別子
 */
export function commandIdChange(func: () => void, beforeKey: string, afterKey:string) {
  return () => {
    vscode.window.showWarningMessage(
      `コマンド「${beforeKey}」は「${afterKey}」に変更されました。\nキーボードショートカット等を使用している場合、新しい識別子で登録し直してください。`,
    );
    func();
  };
}
