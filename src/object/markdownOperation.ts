import { marked } from 'marked';

/**
 * Markdown文字列からTokenを作成します。
 */
export function parseMarkdownToTokens(markdown: string): marked.TokensList {
  const tokens = marked.lexer(markdown);
  return tokens;
}

/**
 * Tokenからimage情報を取得します。
 */
export function getImageInfoFromTokens(tokens: marked.TokensList): marked.Tokens.Image[] {
  const images = tokens.flatMap((token) => {
    if (token.type === 'paragraph') {
      const imageTokens = token.tokens.flatMap((token2) => {
        if (token2.type === 'image') {
          return token2;
        }
        return [];
      });
      return imageTokens;
    }
    return [];
  });
  return images;
}

/**
 * Tokenのimage情報のurlを更新します。
 * @param tokens
 * @param urlList
 * @returns
 */
export function updateImageUrl(
  tokens: marked.TokensList,
  urlList: {
    href: string;
    text: string;
  }[],
): marked.TokensList {
  const newTokens: marked.TokensList = tokens.map((token) => {
    if (token.type === 'paragraph') {
      const newToken = token.tokens.map((token2) => {
        if (token2.type === 'image') {
          const urlInfo = urlList.find((urlInfo) => urlInfo.text === token2.text);
          if (urlInfo) {
            const beforeHref = token2.href;
            const beforeRaw = token2.raw;
            token2.raw = token2.raw.replace(beforeHref, urlInfo.href);
            token2.href = urlInfo.href;

            token.raw = token.raw.replace(beforeRaw, token2.raw);
            token.text = token.text.replace(beforeRaw, token2.raw);
          }
        }
        return token2;
      });
      token.tokens = newToken;
    }
    return token;
  }) as marked.TokensList;
  newTokens.links = tokens.links;
  return newTokens;
}

/**
 * TokenからMarkdown文字列を作成します。
 */
export function parseTokensToMarkdown(tokens: marked.TokensList): string {
  const markdown = tokens.reduce<string>((prev, token) => {
    return prev + token.raw;
  }, '');
  return markdown;
}
