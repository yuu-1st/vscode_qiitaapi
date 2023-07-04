import * as vscode from 'vscode';
import { documentRead, documentWrite } from './object/fileOperating';
import { QiitaParameter } from './object/interface';
import {
  addQiitaParameterToTemplateDefault,
  createQiitaParameterTemplate,
  readQiitaParameter,
} from './object/qiitaParameter';
import { getTemplateDefault } from './object/settingsManagement';

/**
 * ファイルの先頭にテンプレートを追加します。
 */
export function setTemplate() {
  console.log(`qiitaTemplateSetDefault : ${getTemplateDefault()}`);
  // アクティブエディタの取得
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    /** qiitaパラメータ群 */
    const qiitaPrm: QiitaParameter = readQiitaParameter(editor, true);
    const _default = getTemplateDefault();
    if (_default) {
      addQiitaParameterToTemplateDefault(qiitaPrm, _default);
    }
    const param = createQiitaParameterTemplate(qiitaPrm);
    const doc = editor.document;
    /** qiitaパラメータ群を除いた本文 */
    const body = documentRead(doc, qiitaPrm._lastRow);

    documentWrite(editor, `${param}\n${body}`);
  } else {
    vscode.window.showErrorMessage('アクティブエディタが取得できませんでした。');
  }
}
