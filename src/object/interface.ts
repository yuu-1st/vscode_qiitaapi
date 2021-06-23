/**
 * qiita記事へのパラメータ群。
 */
export interface QiitaParameter {
    /** qiita記事のID */
    // eslint-disable-next-line
    ID: string | null;
    /** 限定公開か、公開か */
    private: boolean | null;
    /** 記事のタイトル */
    title: string | null;
    /** 記事につけられたタイトル（５つまで） */
    tags: string[];
    /** 記事を公開したときにツイートするかどうか */
    istweet: boolean | null;
    /** パラメータ群が記述されていた最後の行 */
    _lastRow: number;
}

/**
 * qiita テンプレートのデフォルト値を扱う値群です
 */
export const arrayQiitatempleteDefault = ["private", "public and tweet", "public but no tweet", "no_use"] as const;

/**
 * qiita テンプレートのデフォルト値を扱うtypeです。
 */
export type TypeQiitaTempleteDefault = typeof arrayQiitatempleteDefault[number];
