// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { qiitaPost } from "./post";
import { setTemplete } from "./set_templete";
import { checkExtensionsUpdate } from "./object/check_update";
import { articleUrl } from "./get_articleurl";

/**
 * このメソッドは、拡張機能がアクティブ化されたときに呼び出されます
 * コマンドが最初に実行されたときに拡張機能がアクティブ化されます
 * @param context
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "vscode-qiitaapi" is now active!');

    /**
     * 記事を投稿/更新する
     */
    const commandQiitaPost = vscode.commands.registerCommand("vscode_qiitaapi.post", qiitaPost);

    /**
     * テンプレートをファイルに付与する
     */
    const commandSetTemplete = vscode.commands.registerCommand("vscode_qiitaapi.set_templete", setTemplete);

    /**
     * 投稿済みの記事からurlを取得する。
     */
    const commandGetUrl = vscode.commands.registerCommand("vscode_qiitaapi.geturl", articleUrl);

    context.subscriptions.push(commandQiitaPost, commandSetTemplete, commandGetUrl);

    // アップデートしたかどうかのチェック
    checkExtensionsUpdate(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}
