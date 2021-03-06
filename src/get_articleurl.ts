import * as vscode from "vscode";
import { getUrlFromQiitaParameter, readQiitaParameter } from "./object/qiita_parameter";
import * as clipboardy from "clipboardy";
/**
 * 投稿済みの記事からurlを取得し、クリップボードに貼り付けます。
 * @param isMarkDown
 */
export async function articleUrl() {
    // アクティブエディタの取得
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        let qiitaTemplete = readQiitaParameter(editor,true);

        const url = getUrlFromQiitaParameter(qiitaTemplete);
        if(url){
            const items  = ["urlのみコピー", "MarkDown形式でコピー"];
            vscode.window.showInformationMessage("リンクの準備ができました。", ...items).then((e) => {
                let copyValue :string | null = null;
                if (e === items[0]) {
                    copyValue = url;
                }else if(e === items[1]){
                    copyValue = `[${qiitaTemplete.title}](${url})`;
                }
                if(copyValue){
                    clipboardy.writeSync(copyValue);
                }
            });
        }else{
            vscode.window.showErrorMessage("urlを取得できませんでした。");
        }
    }
}
