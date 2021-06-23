import * as qiita_types from "./qiita-types";
import request = require("request-promise-native");
import { QiitaParameter } from "./interface";

interface QiitaApiPostData {
    json: any;
}

interface QiitaApiResponceData {
    /**
     * ステータスコードメモ：
     * 成功：200（手動）
     * アクセストークンエラー：401
     * ネットワーク未接続：undefined
     * (Bad Request)：400
     * (Forhidden。メンテナンスとか)：403
     * (urlエラー)：404
     * (サーバーエラー)：500
     */
    statuscode: string;
    body: any; //object?
}

type HttpMethod = "POST" | "GET" | "PATCH";

export class ConnectQiitaApi {
    /**
     * qiita apiに接続します。アクセストークンは設定されているものとします。
     * @param method get通信かpost通信かpatch通信か
     * @param url "/"以降のurl
     * @param qiitaAccesstoken qiitaのアクセストークン
     * @param body post通信の場合に送信するデータ
     * @returns
     */
    private static async sendAPI(
        method: HttpMethod,
        url: string,
        qiitaAccesstoken: string,
        body?: QiitaApiPostData
    ): Promise<QiitaApiResponceData> {
        url = "https://qiita.com" + url;
        let options: request.RequestPromiseOptions = {
            headers: {
                // eslint-disable-next-line
                "Content-type": "application/json",
                // eslint-disable-next-line
                Authorization: "Bearer " + qiitaAccesstoken,
            },
        };
        if (method === "GET") {
            options.method = method;
        } else {
            options.method = method;
            options.json = body?.json;
        }
        console.log(options);
        const res: QiitaApiResponceData = await request(url, options)
            .then((html) => {
                const ret: QiitaApiResponceData = {
                    statuscode: "200",
                    body: {},
                };
                if (method === "GET") {
                    try {
                        ret.body = JSON.parse(html);
                    } catch (e) {
                        console.log(html);
                        ret.statuscode = "-100"; // エラーステータス
                    }
                } else {
                    ret.body = html;
                }
                return ret;
            })
            .catch((error) => {
                console.log("SendAPI Error : ");
                console.log(error);
                const ret: QiitaApiResponceData = {
                    statuscode: error.statusCode + "",
                    body: null,
                };
                return ret;
            });
        return res;
    }

    /**
     * アクセストークンに基づいたユーザー情報を返します。
     */
    public static async authenticatedUser(qiitaAccesstoken: string): Promise<qiita_types.AuthenticatedUser> {
        const method: HttpMethod = "GET";
        const api = "/api/v2/authenticated_user";

        const res = await ConnectQiitaApi.sendAPI(method, api, qiitaAccesstoken);

        if (res.statuscode === "200") {
            return res.body as qiita_types.AuthenticatedUser;
        } else {
            console.error("status code : " + res.statuscode);
            throw new Error(res.statuscode);
        }
    }

    /**
     * 指定されたタグの情報を返します。
     * @param tagName タグ名
     * @returns タグデータ
     * TODO : tag_nameが空文字だった場合は-200のエラーを通過するので引数除外するかnullを返すか
     */
    public static async findTag(qiitaAccesstoken: string, tagName: string): Promise<qiita_types.Tag> {
        const method: HttpMethod = "GET";
        const api = "/api/v2/tags/";
        const res = await ConnectQiitaApi.sendAPI(method, api + encodeURIComponent(tagName), qiitaAccesstoken);

        if (res.statuscode === "200") {
            if (Array.isArray(res.body)) {
                // タグ単体指定の場合は配列は戻ってこない
                console.error("return json is only object, but return array.");
                throw new Error("-200");
            } else {
                return res.body as qiita_types.Tag;
            }
        } else {
            console.error("status code : " + res.statuscode);
            throw new Error(res.statuscode);
        }
    }

    /**
     * 記事を新規投稿します
     * @param body 本文
     * @param qiitaPrm
     * @returns
     */
    public static async postNewItem(qiitaAccesstoken: string, body: string, qiitaPrm: QiitaParameter): Promise<qiita_types.Item> {
        const method: HttpMethod = "POST";
        const api = "/api/v2/items";
        const senddata = {
            body: body,
            private: qiitaPrm.private === false ? false : true,
            tags: qiitaPrm.tags.map((e) => {
                return { name: e };
            }),
            title: qiitaPrm.title,
            tweet: qiitaPrm.istweet,
        };
        const res = await ConnectQiitaApi.sendAPI(method, api, qiitaAccesstoken, { json: senddata });

        if (res.statuscode === "200") {
            return res.body as qiita_types.Item;
        } else {
            console.error("status code : " + res.statuscode);
            throw new Error(res.statuscode);
        }
    }

    /**
     * 記事を更新します。
     * @param body 本文
     * @param qiitaPrm
     * @returns
     */
    public static async postUpdateItem(qiitaAccesstoken: string, body: string, qiitaPrm: QiitaParameter): Promise<qiita_types.Item> {
        const method: HttpMethod = "PATCH";
        const api = "/api/v2/items/" + qiitaPrm.ID;
        const senddata = {
            body: body,
            private: qiitaPrm.private === false ? false : true,
            tags: qiitaPrm.tags.map((e) => {
                return { name: e };
            }),
            title: qiitaPrm.title,
        };
        const res = await ConnectQiitaApi.sendAPI(method, api, qiitaAccesstoken, { json: senddata });

        if (res.statuscode === "200") {
            return res.body as qiita_types.Item;
        } else {
            console.error("status code : " + res.statuscode);
            throw new Error(res.statuscode);
        }
    }
}
