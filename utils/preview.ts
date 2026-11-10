// 一覧に出す本文の書き出し。Markdownの記号を取り除き、最初の文章を1行にまとめる
export const previewOf = (body: string): string => {
  const text = body
    .replace(/```[^\n]*\n?/g, '') // コードブロックの囲み
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // 画像
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // リンク
    .split('\n')
    .map((line) =>
      line
        .replace(/^\s*(#{1,6}|>+|[-*+]|\d+[.)])\s+/, '') // 見出し・引用・箇条書きの頭
        .replace(/^\s*[-*_]{3,}\s*$/, '') // 区切り線
        .replace(/^\s*\|?[\s:|-]+\|?\s*$/, '') // 表の区切り行
        .replace(/[*_~`]/g, '') // 強調などの記号
        .replace(/\|/g, ' ')
        .trim()
    )
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ');
  return text.slice(0, 120);
};
