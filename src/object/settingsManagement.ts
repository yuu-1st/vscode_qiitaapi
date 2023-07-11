import * as vscode from 'vscode';
import * as interfaces from './interface';
/**
 * qiitaのアクセストークンが保存されているか確認します。
 * @returns 保存されている場合はトークン、保存されていない場合はnull
 */
export function checkQiitaAccessToken(): string | null {
  const accessToken: string = vscode.workspace.getConfiguration('vscode_qiitaapi').accesstoken;
  if (accessToken === '') {
    return null;
  } else {
    /** アクセストークンは0-9a-fの40文字（JSON Schemaにて記述を確認・問い合わせて確認済み） */
    if (!/^[0-9a-f]{40}$/.test(accessToken)) {
      return null;
    }
    return accessToken;
  }
}

/**
 * vscodeのconfigを取得します。
 * @returns
 */
function getConfig(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration('vscode_qiitaapi');
}

/**
 * 旧configurationに設定されている値を新しいconfigurationに移行します。
 * @param oldConfig 旧configuration名
 * @param newConfig 新configuration名
 * @param isDeleteOldConfig 旧configurationを削除するかどうか
 * @returns
 */
export async function migrateConfig(
  oldConfig: string,
  newConfig: string,
  isDeleteOldConfig: boolean,
) {
  const config = getConfig();
  const oldConfigValue = config.inspect(oldConfig);
  if (oldConfigValue !== undefined) {
    const keyList = [
      ['globalValue', 'Global'],
      ['workspaceValue', 'Workspace'],
      ['workspaceFolderValue', 'WorkspaceFolder'],
    ] as const;
    await Promise.all(
      keyList.map(async ([key, target]) => {
        if (oldConfigValue[key] !== undefined) {
          // 新しいconfigurationに値がセットされていない場合のみ移行する
          const newConfigValue = config.inspect(newConfig);
          if (newConfigValue === undefined) {
            await config.update(newConfig, oldConfigValue[key], vscode.ConfigurationTarget[target]);
            if (isDeleteOldConfig) {
              await config.update(oldConfig, undefined, vscode.ConfigurationTarget[target]);
            }
          }
        }
      }),
    );
  }
}
/**
 * vscode_qiitaapi.templateDefaultにセットしている値を返します。セットされていない場合はnullを返します。
 * @returns
 */
export function getTemplateDefault(): interfaces.TypeQiitaTemplateDefault | null {
  const templateDefault: string = getConfig().templateDefault;

  return interfaces.arrayQiitaTemplateDefault.find((e) => e === templateDefault) ?? null;
}

/**
 * vscode_qiitaapi.templateDelimiterにセットしている値を返します。セットされていない場合はnullを返します。
 * @returns
 */
export function getTemplateDelimiter(): interfaces.TypeQiitaTemplateDelimiter | null {
  const templateDelimiter: string = getConfig().templateDelimiter;
  return interfaces.arrayQiitaTemplateDelimiter.find((e) => e === templateDelimiter) ?? null;
}

/**
 * vscode_qiitaapi.useCopyInUploadImageにセットしている値を返します。
 */
export function getUseCopyInUploadImage(): boolean {
  return getConfig().useCopyInUploadImage;
}

/**
 * vscode_qiitaapi.uploadImageBeforePostにセットしている値を返します。
 */
export function getUploadImageBeforePost(): boolean {
  return getConfig().uploadImageBeforePost;
}
