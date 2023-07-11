export const publisher = 'yuuyu';

export const appName = 'vscode-qiitaapi';

export const displayName = 'vscode_qiitaapi';

export const extensionId = `${publisher}.${appName}`;

/** Code Spell Checkerによるエラー表示を1ヶ所にまとめるため */
export const templateTypo = 'templete';

/** Code Spell Checkerによるエラー表示を1ヶ所にまとめるため */
export const getUrlTypo = 'geturl';

/**
 * 定数文字列を定義します。
 */
export const constants = {
  command: {
    getUrl: `${displayName}.getUrl`,
    getUrlTypo: `${displayName}.${getUrlTypo}`,
    post: `${displayName}.post`,
    setTemplate: `${displayName}.setTemplate`,
    setTemplateTypo: `${displayName}.set_${templateTypo}`,
    uploadImage: `${displayName}.uploadImage`,
  },
  configuration: {
    accessToken: 'accesstoken',
    templateDefault: 'templateDefault',
    templateDefaultTypo: `${templateTypo}default`,
    templateDelimiter: 'templateDelimiter',
    templateDelimiterTypo: `${templateTypo}Delimiter`,
  },
} as const;

/**
 * url
 */
export const url = {
  changeLog: 'https://marketplace.visualstudio.com/items/yuuyu.vscode-qiitaapi/changelog',
  uploadImages: 'https://qiita.com/settings/uploading_images',
} as const;
