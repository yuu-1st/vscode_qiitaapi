import * as vscode from 'vscode';
import { documentRead } from './fileOperating';
import { QiitaParameter, TypeQiitaTemplateDefault } from './interface';
import { getTemplateDelimiter } from './settingsManagement';

/**
 * qiita記事のパラメータが埋め込まれているか確認し、埋め込まれている場合は取得します。
 * @param editor 確認したいファイルエディタ
 * @param isIdErrorThenContinue 入力値にエラーがあった場合、読み込みを続行するかどうか。既定値：false
 * @returns qiita_parameterインターフェース
 */
export function readQiitaParameter(
  editor: vscode.TextEditor,
  isIdErrorThenContinue: boolean = false,
): QiitaParameter {
  /** 開始/終了の目印となる文字列の正規表現。ちなみに「//**(*は最低10)」という文字列 */
  const keyRegularExpression = /^\/\/\*{10,}$|^---$/;
  /** 戻り値となるオブジェクト */
  const returnvalue: QiitaParameter = {
    // eslint-disable-next-line
    ID: null,
    private: null,
    title: null,
    tags: [],
    istweet: null,
    _lastRow: 0,
  };
  /** 開始行に到達しているか */
  let isStarted = false;
  /** 終了行に到達しているか */
  let isEnded = false;

  const doc = editor.document;
  for (let i = 0; i < doc.lineCount; i++) {
    /** １行を取得 */
    const text = documentRead(doc, i, i + 1).trim();
    // 判定していく
    if (!isStarted) {
      if (text === '') {
        // 空白行は無視する
      } else if (keyRegularExpression.test(text)) {
        isStarted = true;
        returnvalue._lastRow = -1; // 終了タグが見つからなかった時にエラーを出力できるように。
      } else {
        break; // 最初に文字を含む場合は、全てMDコードと判断しループから抜ける
      }
    } else if (isEnded) {
      if (text === '') {
        // 空白行は除外する
      } else {
        returnvalue._lastRow = i;
        break;
      }
    } else {
      const strBefore = /^ ?\*? ?([^: ]*) ?:/.exec(text.replace(/ +/g, ' '));
      let strAfter: RegExpExecArray | string | null = /^[^:]*:(.*)$/.exec(text);
      // 整形。string型にする
      if (strAfter && strAfter[1]) {
        strAfter = strAfter[1].trim();
      } else {
        strAfter = '';
      }
      if (strBefore && strBefore[1]) {
        if (strBefore[1] === 'ID') {
          if (strAfter.length > 0) {
            try {
              returnvalue.ID = checkAndInsertQiitaId(strAfter);
            } catch (e) {
              vscode.window.showErrorMessage(
                'qiita_idは0-9かa-fの20文字で構成されている必要があります.',
              );
              if (!isIdErrorThenContinue) {
                throw new Error('ID is not safety.');
              }
            }
          }
        } else if (strBefore[1] === 'private') {
          returnvalue.private = checkAndInsertBoolean(strAfter, 'private');
        } else if (strBefore[1] === 'title') {
          if (strAfter.length < 256) {
            returnvalue.title = strAfter;
          } else {
            vscode.window.showErrorMessage(`titleは255文字までしか設定できません。：${strAfter}`);
          }
        } else if (strBefore[1] === 'tags') {
          returnvalue.tags = strAfter.split(/[,\s]+/);
          if (returnvalue.tags.length > 5) {
            vscode.window.showErrorMessage(
              `Tagsは5つまでしか設定できません。6つ目以降は無視されます。`,
            );
            returnvalue.tags = returnvalue.tags.slice(0, 5);
          }
          returnvalue.tags = returnvalue.tags.map((e) => e.trim()); // 両端の空白を消す
        } else if (strBefore[1] === 'istweet') {
          returnvalue.istweet = checkAndInsertBoolean(strAfter, 'istweet', false);
        } else if (strBefore[1] === '') {
          // 空白行は無視します。
        } else {
          vscode.window.showErrorMessage(
            `qiitaパラメータ「${strBefore[1]}」が見つかりませんでした。このワードは無視されます。`,
          );
        }
      } else if (keyRegularExpression.test(text)) {
        isEnded = true;
        returnvalue._lastRow = i + 1; // 最終行まで空白だとパラメータがpostされてしまうため
      }
    }
  }
  return returnvalue;
}

/**
 * qiita_idが正しいかチェックします。
 * @param str
 * @returns
 * @throws Error 正規表現で失敗した時。
 */
function checkAndInsertQiitaId(str: string): string {
  // qiita api v2 の時点で求められるIDは、正規表現で/^[0-9a-f]{20}$/となっています。
  if (/^[0-9a-f]{20}$/.test(str)) {
    return str;
  } else {
    throw new Error('checkAndInsertQiitaId failed.');
  }
}

/**
 * 文字列をboolean型に変換します。true,falseどちらとも認識できなかった場合はnullを返します。
 * @param str 変換対象の文字列
 * @param type エラー時に出力するキー
 * @returns
 */
function checkAndInsertBoolean(
  str: string,
  type: string,
  _default: boolean | null = null,
): boolean | null {
  if (/^true$/i.test(str)) {
    return true;
  } else if (/^false$/i.test(str)) {
    return false;
  } else {
    let mes = '';
    if (_default === null) {
      mes = 'この入力は無視されます。';
    } else {
      mes = `既定値${_default}が使用されます。`;
    }
    vscode.window.showErrorMessage(`「${type}」の値が正しくありません。${mes}`);
    return _default;
  }
}

/**
 * 不足しているqiitaパラメータを入力してもらいます。
 * @param editor
 * @param qiitaPrm
 * @returns
 */
export async function addQiitaParameter(
  editor: vscode.TextEditor,
  qiitaPrm: QiitaParameter,
): Promise<QiitaParameter | null> {
  // タイトルが未設定 or 空白
  if (!(qiitaPrm.title && qiitaPrm.title.length > 0)) {
    qiitaPrm.title = '';
    await vscode.window
      .showInputBox({ placeHolder: '記事のタイトル。1~255文字必要です。' })
      .then((e) => {
        if (!e || e.length === 0) {
          vscode.window.showErrorMessage('タイトルの文字が入力されませんでした。');
        } else if (e.length > 255) {
          vscode.window.showErrorMessage(
            `タイトルの文字が長すぎます。255文字以内に納めてください。：${e}`,
          );
        } else {
          qiitaPrm.title = e;
        }
      });
    if (qiitaPrm.title.length === 0) {
      return null;
    }
  }

  // 公開範囲が未設定
  if (qiitaPrm.private === null) {
    const pub: string = 'public(公開)';
    const pri: string = 'private(非公開)';
    const pubNoTweet: string = 'public(公開)・twitterに投稿をしない';
    const pubTweeted: string = 'public(公開)・twitterに投稿をする';
    let choices: string[] = [pri, pub];
    if (qiitaPrm.istweet === null) {
      if (qiitaPrm.ID) {
        qiitaPrm.istweet = false;
      } else {
        choices = [pri, pubNoTweet, pubTweeted];
      }
    }

    await vscode.window.showQuickPick(choices, { canPickMany: false }).then((e) => {
      if (e === pub) {
        qiitaPrm.private = false;
      } else if (e === pubNoTweet) {
        qiitaPrm.private = false;
        qiitaPrm.istweet = false;
      } else if (e === pubTweeted) {
        qiitaPrm.private = false;
        qiitaPrm.istweet = true;
      } else if (e === pri) {
        qiitaPrm.private = true;
        qiitaPrm.istweet = false;
      } else {
        vscode.window.showErrorMessage('公開範囲設定画面でキャンセルされました。');
      }
    });
    if (qiitaPrm.private === null) {
      return null;
    }
  }

  // タグが未設定の場合
  if (qiitaPrm.tags.length === 0) {
    const options: vscode.InputBoxOptions = {
      placeHolder: 'タグ。空白もしくは「,」区切りで５つまで記述することが出来ます。',
    };
    await vscode.window.showInputBox(options).then((e) => {
      if (e) {
        const tags = e
          .split(/[\s,]+/)
          .map((e) => e.trim())
          .filter((v) => v !== '');
        if (tags.length > 5) {
          vscode.window.showErrorMessage(`タグは５つまでしか設定できません。：${e}`);
        } else {
          qiitaPrm.tags = tags;
        }
      } else {
        vscode.window.showErrorMessage('タグ設定画面でキャンセルされました。');
      }
    });
  }

  return qiitaPrm;
}

/**
 * qiita パラメータの各行に付与する情報の列のテンプレートを返します。
 * @param title パラメータ名
 * @param isAsterisk アスタリスクが必要か。
 */
function infoMessageSet(
  title: string,
  maxLength: number,
  isAsterisk: boolean,
  value: string,
): string {
  return `\n  ${isAsterisk ? '*' : ''} ${title.padStart(maxLength, ' ')} : ${value}`;
}

/**
 * 埋め込み用のqiita記事のパラメータの文字列を作成します。
 * @param qiitaPrm
 * @returns
 */
export function createQiitaParameterTemplate(qiitaPrm: QiitaParameter | null): string {
  /** 添付するキー一覧 */
  const setKeys = ['ID', 'title', 'private', 'istweet', 'tags'];
  /** SetKeysで最大の文字数 */
  const maxLength: number = Math.max(...setKeys.map((e) => e.length));
  /** 開始及び終了のライン */
  const startAndEndMark = getTemplateDelimiter() === 'horizon' ? '---' : `//${'*'.repeat(20)}`;
  /** アスタリスクが必要か */
  const needAsterisk: boolean = getTemplateDelimiter() === 'horizon' ? false : true;

  let returnvalue = startAndEndMark;

  if (qiitaPrm) {
    (Object.keys(qiitaPrm) as (keyof QiitaParameter)[]).forEach((key) => {
      if (setKeys.find((e) => e === key)) {
        const objectValue = qiitaPrm[key];
        const value = (() => {
          if (objectValue === null) {
            return '';
          } else if (typeof objectValue === 'string') {
            return objectValue;
          } else if (typeof objectValue === 'boolean') {
            return objectValue ? 'true' : 'false';
          } else if (typeof objectValue === 'object') {
            return objectValue.join(', ');
          } else if (typeof objectValue === 'number') {
            return objectValue.toString();
          } else {
            const a: never = objectValue;
            throw new Error(`Unexpected type. ${a}`);
          }
        })();
        returnvalue += infoMessageSet(key, maxLength, needAsterisk, value);
      }
    });
  }
  returnvalue += `\n${startAndEndMark}\n`;
  return returnvalue;
}

/**
 * qiita_prmにデフォルト値を加算します。
 * @param qiitaPrm
 * @param _default
 */
export function addQiitaParameterToTemplateDefault(
  qiitaPrm: QiitaParameter,
  _default: TypeQiitaTemplateDefault,
): void {
  if (qiitaPrm.private === null) {
    if (_default === 'private') {
      qiitaPrm.private = true;
    } else if (_default === 'public and tweet' || _default === 'public but no tweet') {
      qiitaPrm.private = false;
    }
  }
  if (qiitaPrm.istweet === null) {
    if (_default === 'public and tweet') {
      qiitaPrm.istweet = true;
    } else if (_default === 'private' || _default === 'public but no tweet') {
      qiitaPrm.istweet = false;
    }
  }
}

/**
 * qiita パラメータからurlを生成し、返します。
 * @param qiitaPrm チェックするqiita パラメータ
 * @returns
 */
export function getUrlFromQiitaParameter(qiitaPrm: QiitaParameter): string | null {
  if (qiitaPrm.ID) {
    return `https://qiita.com/${qiitaPrm?.private ? 'private' : 'items'}/${qiitaPrm?.ID}`;
  } else {
    return null;
  }
}
