export const isRootRelative = (url) =>
  url.startsWith('/') &&
  !url.startsWith('//') &&
  !url.startsWith('http://') &&
  !url.startsWith('https://');

// this is to support feature branch urls
export const getSrcUrl = (url: string) =>
  isRootRelative(url) ? `${process.env.PUBLIC_URL}${url}` : url;
