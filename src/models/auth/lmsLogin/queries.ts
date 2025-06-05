const base64ToBuf = (key: string) =>
  Uint8Array.from(atob(key), (c) => c.charCodeAt(0));

export const decrypt = async (
  encryptedText: string,
  ENCRYPTION_KEY: string,
) => {
  const key = await window.crypto.subtle.importKey(
    'raw',
    base64ToBuf(ENCRYPTION_KEY),
    { name: 'AES-CBC', length: 128 },
    true,
    ['encrypt', 'decrypt'],
  );
  const [iv, cipherText] = encryptedText.split('.');
  const plainTextBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-CBC', iv: base64ToBuf(iv) },
    key,
    base64ToBuf(cipherText),
  );
  return new TextDecoder().decode(plainTextBuffer);
};

export const getAuthTokenFromCookie = () => {
  const cookieArr = document.cookie.split(';');

  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split('=');

    if (cookiePair[0].trim() === 'auth_token') {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
};
