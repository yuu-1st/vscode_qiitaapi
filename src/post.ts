import * as vscode from 'vscode';
import {
  readQiitaParameter,
  addQiitaParameter,
  createQiitaParameterTemplete,
  getUrlFromQiitaParameter,
} from './object/qiitaParameter';
import * as set_management from './object/settingsManagement';
import { ConnectQiitaApi } from './object/connectQiitaApi';
import * as qiita_types from './object/qiitaTypes';
import { documentRead, documentWrite, getFileExtension } from './object/fileOperating';
import { execSync } from 'child_process';
import { QiitaParameter } from './object/interface';

/**
 * qiitaに投稿します。
 * @returns
 */
export async function qiitaPost() {
  const qiitaAccessToken = set_management.checkQiitaAccessToken();
  // トークンの確認
  if (!qiitaAccessToken) {
    vscode.window.showErrorMessage(
      'Qiitaのアクセストークンが未記入か不正です。：vscode_qiitaapi.accesstoken',
    );
    return;
  }

  /**
   * Connect_Qiita_APIクラスから例外が戻ってきた時にエラーメッセージを表示します。
   * @param e
   */
  const connectionExceptionMessage = (e: Error) => {
    console.error(e.message);
    if (e.message === '401') {
      vscode.window.showErrorMessage(
        'アクセストークンのチェックに失敗しました。トークンを確認してください。：vscode_qiitaapi.accesstoken',
      );
    } else if (e.message === '403') {
      vscode.window.showErrorMessage(
        '通信が拒否されました。トークンに権限があるか確認してください。',
      );
    } else if (e.message === '404') {
      vscode.window.showErrorMessage('qiitaの記事が見つかりませんでした。更新できませんでした。');
    } else if (e.message === '-100') {
      vscode.window.showErrorMessage(
        '通信に成功しましたが、受信したデータが破損していたため、続行できません。',
      );
    } else {
      vscode.window.showErrorMessage('通信にエラーが発生したため、続行できません。');
    }
  };

  // アクティブエディタの取得
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    let fileExtension = '';
    // [[JS] もう少し厳密に URL からファイル名等を取得する正規表現 - Qiita](https://qiita.com/kerupani129/items/adc0fba4ab248330e443)
    // ファイル拡張子の判断
    const ext = getFileExtension(editor.document.fileName);
    if (!ext) {
    } else if (/^.md$/i.test(ext)) {
      fileExtension = 'md';
    } else if (/^.org$/i.test(ext)) {
      fileExtension = 'org';
    } else if (/^.html$/i.test(ext)) {
      fileExtension = 'html';
    } else {
      vscode.window.showErrorMessage(
        `対応していない拡張子のファイルはアップロードできません。：${ext}`,
      );
      return;
    }

    // qiita IDが正しいかチェックする
    try {
      const data: qiita_types.AuthenticatedUser = await ConnectQiitaApi.authenticatedUser(
        qiitaAccessToken,
      );
      vscode.window.setStatusBarMessage(`Qiita ID「${data.id}」に投稿します。`, 10000);
    } catch (e) {
      connectionExceptionMessage(e as any);
      return;
    }

    const doc = editor.document;

    /** qiitaパラメータ群 */
    let qiitaPrm: QiitaParameter | null = readQiitaParameter(editor);
    /** qiitaパラメータ群を除いた本文 */
    const body = documentRead(doc, qiitaPrm._lastRow);
    let sendBody: string = '';

    if (fileExtension !== 'md') {
      try {
        const pandoc = execSync(`pandoc -f ${fileExtension} -t markdown`, { input: body });
        sendBody = pandoc.toString();
      } catch (e) {
        console.log(e);
        vscode.window.showErrorMessage('pandocの実行に失敗しました。操作を続行できません。');
        return;
      }
    } else {
      sendBody = body;
    }

    // 足りないqiitaパラメータを入力する
    try {
      qiitaPrm = await addQiitaParameter(editor, qiitaPrm);
    } catch (e) {
      console.error(e);
      return;
    }

    // 入力内容を確認し、投稿する
    if (qiitaPrm) {
      if (qiitaPrm.ID) {
        try {
          await ConnectQiitaApi.postUpdateItem(qiitaAccessToken, sendBody, qiitaPrm);
        } catch (e) {
          connectionExceptionMessage(e as any);
          return;
        }
      } else {
        let receiveData: qiita_types.Item;
        try {
          receiveData = await ConnectQiitaApi.postNewItem(qiitaAccessToken, sendBody, qiitaPrm);
        } catch (e) {
          connectionExceptionMessage(e as any);
          return;
        }
        qiitaPrm.ID = receiveData.id;
      }
      vscode.window.showInformationMessage('Qiitaに投稿しました。', '表示').then((e) => {
        if (e === '表示') {
          if (qiitaPrm) {
            const url = getUrlFromQiitaParameter(qiitaPrm) ?? '';
            vscode.env.openExternal(vscode.Uri.parse(url));
          }
        }
      });

      const param = createQiitaParameterTemplete(qiitaPrm);

      documentWrite(editor, `${param}\n${body}`);
    }
  } else {
    vscode.window.showErrorMessage('アクティブエディタが取得できませんでした。');
  }
}
