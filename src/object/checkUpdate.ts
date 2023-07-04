// [更新時にVSCode拡張機能/カラーテーマ通知のユーザーに表示することは可能ですか？](https://www.fixes.pub/program/285186.html)
import * as vscode from 'vscode';
import { migrateConfig } from './settingsManagement';

const extensionId = 'yuuyu.vscode-qiitaapi';

/**
 * メジャーアップデートかどうか
 * 参照元の参照元：https://stackoverflow.com/a/66303259/3073272
 * @param previousVersion
 * @param currentVersion
 * @returns
 */
function isMajorUpdate(previousVersion: string, currentVersion: string) {
  //rain-check for malformed string
  if (previousVersion.indexOf('.') === -1) {
    return true;
  }
  //returns int array [1,1,1] i.e. [major,minor,patch]
  var previousVerArr = previousVersion.split('.').map(Number);
  var currentVerArr = currentVersion.split('.').map(Number);
  if (currentVerArr[0] > previousVerArr[0]) {
    return true;
  } else {
    return false;
  }
}

/**
 * マイナーアップデートかどうか。これはメジャーバージョンのアップデートによりマイナーバージョンが0になった時もtrueを返します。
 * 参照元の参照元：https://stackoverflow.com/a/66303259/3073272
 * @param previousVersion
 * @param currentVersion
 * @returns
 */
function isMinorUpdate(previousVersion: string, currentVersion: string) {
  //rain-check for malformed string
  if (previousVersion.indexOf('.') === -1) {
    return true;
  }
  //returns int array [1,1,1] i.e. [major,minor,patch]
  var previousVerArr = previousVersion.split('.').map(Number);
  var currentVerArr = currentVersion.split('.').map(Number);
  if (currentVerArr[1] === 0 && isMajorUpdate(previousVersion, currentVersion) === true) {
    return true;
  } else if (currentVerArr[1] > previousVerArr[1]) {
    return true;
  } else {
    return false;
  }
}

/**
 * バージョンアップ時に実行する処理
 * @param previousVersion 過去のバージョン
 * @param currentVersion 現在のバージョン
 */
export async function executeOnUpdate(previousVersion: string, currentVersion: string) {
  // 前回のバージョンが0.6.0未満の場合
  if (isMinorUpdate(previousVersion, '0.6.0')) {
    // configuration名の変更
    await migrateConfig('templetedefault', 'templateDefault', true);
    migrateConfig('templateDelimiter', 'templateDelimiter', true);
  }
}

export async function checkExtensionsUpdate(context: vscode.ExtensionContext) {
  /** 過去のバージョンを取得 */
  const previousVersion = context.globalState.get<string>(extensionId);
  /** 現在のバージョンを取得 */
  const currentVersion = vscode.extensions.getExtension(extensionId)!.packageJSON.version;
  // 現在のバージョンを保存
  // context.globalState.update(extensionId, currentVersion);
  if (previousVersion !== undefined && isMinorUpdate(previousVersion, currentVersion)) {
    // バージョンアップ時に実行する処理
    await executeOnUpdate(previousVersion, currentVersion);
    //show whats new notification:
    const actions = [{ title: '更新内容の表示' }, { title: '閉じる' }];
    vscode.window.showInformationMessage(
      `vscode_qiitaapi を v${currentVersion} にアップデートしました。`,
      ...actions,
    ).then((result) => {
      if (result !== null) {
        if (result === actions[0]) {
          vscode.env.openExternal(
            vscode.Uri.parse(
              'https://marketplace.visualstudio.com/items/yuuyu.vscode-qiitaapi/changelog',
            ),
          );
        }
      }
    });
  }
}
