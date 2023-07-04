// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { qiitaPost } from './post';
import { setTemplate } from './setTemplate';
import { checkExtensionsUpdate } from './object/checkUpdate';
import { articleUrl } from './getArticleUrl';
import { commandIdChange } from './object/commandIdChange';

/**
 * このメソッドは、拡張機能がアクティブ化されたときに呼び出されます
 * コマンドが最初に実行されたときに拡張機能がアクティブ化されます
 * @param context
 */
export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vscode-qiitaapi" is now active!');

  // アップデートしたかどうかのチェック
  await checkExtensionsUpdate(context);

  /**
   * 記事を投稿/更新する
   */
  const commandQiitaPost = vscode.commands.registerCommand('vscode_qiitaapi.post', qiitaPost);

  /**
   * テンプレートをファイルに付与する(typo version。v0.7.0で削除予定)
   */
  const commandSetTemplateTypo = vscode.commands.registerCommand(
    'vscode_qiitaapi.set_templete',
    commandIdChange(setTemplate, 'vscode_qiitaapi.set_templete', 'vscode_qiitaapi.setTemplate'),
  );

  /**
   * テンプレートをファイルに付与する
   */
  const commandSetTemplate = vscode.commands.registerCommand(
    'vscode_qiitaapi.setTemplate',
    setTemplate,
  );

  /**
   * 投稿済みの記事からurlを取得する。(typo version。v0.7.0で削除予定)
   */
  const commandGetUrlTypo = vscode.commands.registerCommand(
    'vscode_qiitaapi.geturl',
    commandIdChange(articleUrl, 'vscode_qiitaapi.geturl', 'vscode_qiitaapi.getUrl'),
  );

  /**
   * 投稿済みの記事からurlを取得する。
   */
  const commandGetUrl = vscode.commands.registerCommand('vscode_qiitaapi.getUrl', articleUrl);

  context.subscriptions.push(
    commandQiitaPost,
    commandSetTemplateTypo,
    commandSetTemplate,
    commandGetUrlTypo,
    commandGetUrl,
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
