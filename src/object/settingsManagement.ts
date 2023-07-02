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
 * vscode_qiitaapi.templetedefaultにセットしている値を返します。セットされていない場合はnullを返します。
 * @returns
 */
export function qiitaTemplateSetDefault(): interfaces.TypeQiitaTemplateDefault | null {
  const templateDefault: string =
    vscode.workspace.getConfiguration('vscode_qiitaapi').templetedefault;

  //    console.log(`templateDefault : ${templateDefault});
  return interfaces.arrayQiitaTemplateDefault.find((e) => e === templateDefault) ?? null;
}

/**
 * vscode_qiitaapi.templeteDelimiterにセットしている値を返します。セットされていない場合はnullを返します。
 * @returns
 */
export function qiitaTemplateGetDelimiter(): interfaces.TypeQiitaTemplateDelimiter | null {
  const templateDelimiter: string =
    vscode.workspace.getConfiguration('vscode_qiitaapi').templeteDelimiter;

  console.log(`templateDelimiter : ${templateDelimiter}`);
  return interfaces.arrayQiitaTemplateDelimiter.find((e) => e === templateDelimiter) ?? null;
}
