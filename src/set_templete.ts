import * as vscode from 'vscode';
import {documentRead, documentWrite} from "./object/file_operating";
import { QiitaParameter } from './object/interface';
import { addQiitaParameterToTempleteDefault, createQiitaParameterTemplete, readQiitaParameter } from './object/qiita_parameter';
import { qiitaTempleteSetDefault } from './object/settings_management';

/**
 * ファイルの先頭にテンプレートを追加します。
 */
export function setTemplete(){
    console.log("qiitatemplete_setdefault : " + qiitaTempleteSetDefault());
    // アクティブエディタの取得
    const editor = vscode.window.activeTextEditor;
    if(editor){
        /** qiitaパラメータ群 */
        const qiitaPrm : QiitaParameter = readQiitaParameter(editor,true);
        const _default = qiitaTempleteSetDefault();
        if(_default){
            addQiitaParameterToTempleteDefault(qiitaPrm,_default);
        }
        const param = createQiitaParameterTemplete(qiitaPrm);
        const doc = editor.document;
        /** qiitaパラメータ群を除いた本文 */
        const body = documentRead(doc,qiitaPrm._lastRow);

        documentWrite(editor,param + "\n" + body);
    }else{
        vscode.window.showErrorMessage("アクティブエディタが取得できませんでした。");
    }
}