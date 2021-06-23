import * as vscode from "vscode";
import * as interfaces from "./interface";
/**
 * qiitaのアクセストークンが保存されているか確認します。
 * @returns 保存されている場合はトークン、保存されていない場合はnull
 */
export function checkQiitaAccesstoken(): string | null {
    const accesstoken: string = vscode.workspace.getConfiguration("vscode_qiitaapi").accesstoken;
    if (accesstoken === "") {
        return null;
    } else {
        /** アクセストークンは0-9a-fの40文字（JSON Schemaにて記述を確認・問い合わせて確認済み） */
        if (!/^[0-9a-f]{40}$/.test(accesstoken)) {
            return null;
        }
        return accesstoken;
    }
}

/**
 * vscode_qiitaapi.templetedefaultにセットしている値を返します。セットされていない場合はnullを返します。
 * @returns
 */
export function qiitaTempleteSetDefault(): interfaces.TypeQiitaTempleteDefault | null {
    const templetedefault: string = vscode.workspace.getConfiguration("vscode_qiitaapi").templetedefault;

    console.log("templetedefault : " + templetedefault);
    return interfaces.arrayQiitatempleteDefault.find((e) => e === templetedefault) ?? null;
}
