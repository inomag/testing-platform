export const decodeMarkup = (hrefString) => {
  const matches: any[] = [];
  hrefString.replace(
    /[^<]*<a href\s*=\s*"([^"]+)"\s*,?\s*(target\s*=\s*"\w+")?>(.*)<\/a>$/g,
    (...args) => {
      matches.push(args);
    },
  );
  return matches[0];
};
