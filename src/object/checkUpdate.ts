// [更新時にVSCode拡張機能/カラーテーマ通知のユーザーに表示することは可能ですか？](https://www.fixes.pub/program/285186.html)
import { diff as semverDiff } from 'semver';
import * as vscode from 'vscode';
import { constants, displayName, extensionId, url } from '../constants';
import { migrateConfig } from './settingsManagement';

/**
 * メジャーアップデートかどうか。
 * @param previousVersion 過去のバージョン
 * @param currentVersion 現在のバージョン
 * @returns
 */
function isMajorUpdate(previousVersion: string, currentVersion: string) {
  return semverDiff(previousVersion, currentVersion) === 'major';
}

/**
 * マイナーアップデートかどうか。
 * @param previousVersion 過去のバージョン
 * @param currentVersion 現在のバージョン
 * @param includeMajor メジャーアップデートもtrueを返すかどうか
 * @returns
 * @example isMinorUpdate('1.2.3', '1.3.0') => true
 * @example isMinorUpdate('1.2.3', '2.0.0') => true
 * @example isMinorUpdate('1.2.3', '2.0.0', false) => false
 * @example isMinorUpdate('1.2.3', '1.2.4') => false
 */
function isMinorUpdate(previousVersion: string, currentVersion: string, includeMajor = true) {
  if (semverDiff(previousVersion, currentVersion) === 'minor') {
    return true;
  }
  if (includeMajor && isMajorUpdate(previousVersion, currentVersion)) {
    return true;
  }
  return false;
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
    await migrateConfig(
      constants.configuration.templateDefaultTypo,
      constants.configuration.templateDefault,
      true,
    );
    await migrateConfig(
      constants.configuration.templateDelimiterTypo,
      constants.configuration.templateDelimiter,
      true,
    );
  }
}

export async function checkExtensionsUpdate(context: vscode.ExtensionContext) {
  /** 過去のバージョンを取得 */
  const previousVersion = context.globalState.get<string>(extensionId);
  /** 現在のバージョンを取得 */
  const currentVersion = vscode.extensions.getExtension(extensionId)!.packageJSON.version;
  // 現在のバージョンを保存
  context.globalState.update(extensionId, currentVersion);
  if (previousVersion !== undefined && isMinorUpdate(previousVersion, currentVersion)) {
    // バージョンアップ時に実行する処理
    await executeOnUpdate(previousVersion, currentVersion);
    //show whats new notification:
    const actions = [{ title: '更新内容の表示' }, { title: '閉じる' }];
    vscode.window
      .showInformationMessage(
        `${displayName} を v${currentVersion} にアップデートしました。`,
        ...actions,
      )
      .then((result) => {
        if (result !== null) {
          if (result === actions[0]) {
            vscode.env.openExternal(vscode.Uri.parse(url.changeLog));
          }
        }
      });
  }
}
