import * as vscode from "vscode";

/**
 * ドキュメントを読み取ります。
 * @param doc
 * @param startlen 読み取り開始の行
 * @param endlen 読み取り終了の行
 * @returns
 */
export function documentRead(doc: vscode.TextDocument, startlen: number = 0, endlen: number = doc.lineCount): string {
    /** 先頭箇所の取得 */
    const topPos = new vscode.Position(startlen, 0);
    /** 最終箇所の取得 */
    const lastPos = new vscode.Position(endlen, 0);
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
 * @param startlen 書き込み開始の行
 * @param endlen 書き込み終了の行
 * @returns
 */
export function documentWrite(edit: vscode.TextEditor, str: string, startlen: number = 0, endlen: number = edit.document.lineCount): void {
    /** 先頭箇所の取得 */
    const topPos = new vscode.Position(startlen, 0);
    /** 最終箇所の取得 */
    const lastPos = new vscode.Position(endlen, 0);
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
    const [, name, ext] = matchedExt.map((match) => match ?? "");
    if (ext) {
        return ext;
    } else {
        return null;
    }
}
