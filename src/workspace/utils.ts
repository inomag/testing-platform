import { isEmpty, isEqual, omitBy } from 'lodash';
import * as openpgp from 'openpgp';
import * as CryptoJS from 'crypto-js';
import Logger from 'src/logger';

const log = new Logger('workspace utils');

const OPEN_PGP =
  '-----BEGIN PGP PUBLIC KEY BLOCK-----\r\n\r\nmQENBFmlDt8BCADm0TaD3E8E6k0BV+4cUGoEK4a2mspbZqlrgi8SSR3knLRkZDLR\n6PT+CdgjXI+UCDm32OMilJYHUTjzcA3nyt4Kbn7dLhjo3QblBN9Z7opiHKeH/VDX\nbjqg8uHXyJGRVQ9U0its27teg+5S+fIUo5YHCrJweolGV3kZOZouNT92/1eWohJr\nixe3pRVwDd4kGTDYR4BBLP+FumAoJJzWU/+ReX2U75YjR5/MtcyE9Wrk8yo6EVxZ\nvJKfYLoG6Ks5r/6bL63DitrRFL9IS7M683fI83yVXQr24/evgrcoPIKOEHZqDOlt\nD4HlGuYwMel9I29eptCWETCYI09DJaFtYVNRABEBAAG0JU9wZW5QR1AgZ2VuZXJh\ndGlvbiA8dnltb0BnZXR2eW1vLmNvbT6JAU4EEwEIADgCGwMFCwkIBwIGFQgJCgsC\nBBYCAwECHgECF4AWIQQuLbNHpLztNZJtpyU6iPy78ZmmPQUCWaUPYgAKCRA6iPy7\n8ZmmPc2wB/9LkEUdhHCmdM0+kXvU8sAZqfn8f9rBTOfj/HprkeHqEMbOB4X0TKW4\nSJIERZsa70nffEDXCzZcCv3zgaKTMQg0E/BAu6K9Hs/vI5/QrUmi3Feq3hSnKi+h\n+o11Dzu6aCbaM5PtlhE0XcQmdOKNcXbU7mR3pLUZDsekNV67FUOl5KqEDvGQ0M79\nIxymq/ZQRv5pF894m/IjGHqrSatpfxPy5a27cXJ/B20VU9HycNCpBxetWFZO3kyp\nOhmzSRWAXIGgziSikza2eQ6OpGUs+8uuOVbICfodyoE8+B/A53p++ySLHduU7KM3\nTjJ3i+TM4uw83JfDTBPz0aoLXwBsxS4suQENBFmlDt8BCACyrm78TkeaQlu5AL4Y\nCxRD1QsewFVTDyH4lIMLOtvOhpX219zrinZer1x8W85p/ADLBUkNvYGJWKW4jgcj\nl8xEy5sl60EdIlKrA7SCT8OK7Jqs+6pxG2sUG1I9v1w+6rVPvuctlwE17QwSZgtE\nJ7kx2FjfHN635K7DtzSphg0CIoSLKlAVXe3xfUk/2bR3zqesUU0Z2O8hpgkNhE6V\nd8IGP2PNNN2JArwhZ5XofHwBOi2D6ZFumT6nLdATl0koYq+3ea8uV/7TH6QjsGTD\nYSkOMzY3M5DchcM9ZuS2I4fhtHPx6tJlzOEnIaqT+A4ZEx9gaooy5QEiRY34F2Yb\nbsB3ABEBAAGJATYEGAEIACACGwwWIQQuLbNHpLztNZJtpyU6iPy78ZmmPQUCWaUP\nwwAKCRA6iPy78ZmmPa74CACtI6uPB0mhurUKa4Low5KwMFupApaYqCIQini5E1GO\nBV2aKwolgLt4irdhJOt6NAtORVM513bDfi9Ai0w6e2O1+lK+ohDVdT5FDzyh1oRC\nwTOauAaMQwLlOFrBdRE76wSSSCTCOU7bEqZo6SpEYIDt64MIZkeBF3tzkrfZLPbd\njeGsllE9O4Cu7KA2MmKx+8hhAacSGe8qQZO7OzpLwmNu0/x/jUvvxpFMNkt7q2QQ\nuBRqlSG9gNOlJ+g+dHoe/4EHtuNV0vKFgtUWp6Rg6HLZqDrbQpcFymcI/Haep6hz\n5aEVXmIpb2J83n88cPfUndcgACa1Z7A3P4yOvTTekq1f\n=TjVR\r\n-----END PGP PUBLIC KEY BLOCK-----';

let reactRouteNavigate = {};
export const setReactRouteNavigate = (navigateRef) => {
  reactRouteNavigate = navigateRef;
};

export const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const parseJSON = (input) => {
  if (typeof input === 'object' && input !== null) {
    return input;
  }
  try {
    return JSON.parse(input);
  } catch (e) {
    return false;
  }
};

export const isValueEmpty = (value) => {
  if (value === null || value === undefined || value === '') {
    return true;
  }

  if (typeof value === 'object') {
    return isEmpty(value);
  }
  return false;
};

export const encrypt = (text, id) => CryptoJS.AES.encrypt(text, id);

export const encryptPgp = async (data) => {
  const encryptionKeys = await openpgp.readKey({ armoredKey: OPEN_PGP });
  const options = {
    message: await openpgp.createMessage({ text: data }),
    encryptionKeys,
  };
  return openpgp
    .encrypt(options)
    .then((encrypted) => encrypted)
    .catch((e) => log.error(e));
};

export const decrypt = (cypherText, id) => {
  if (cypherText) {
    const decrypted = CryptoJS.AES.decrypt(cypherText, id);
    let decryptedValue: any = null;
    try {
      decryptedValue = decrypted.toString(CryptoJS.enc.Utf8);
      decryptedValue = JSON.parse(decryptedValue);
      if (!isEmpty(decryptedValue)) {
        return decryptedValue;
      }
      return isJsonString(cypherText) ? JSON.parse(cypherText) : cypherText;
    } catch {
      if (!isEmpty(decryptedValue)) {
        return decryptedValue;
      }
      return isJsonString(cypherText) ? JSON.parse(cypherText) : cypherText;
    }
  }
  return isJsonString(cypherText) ? JSON.parse(cypherText) : cypherText;
};

export const getDecryptedEnvValue = (key) => {
  const encryptedValue = process.env[key] ?? '';
  try {
    const decryptValue = decrypt(encryptedValue, '##vymo##');
    return decryptValue;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return '';
  }
};

export const isNodeDescendant = (parent, node) => {
  let current = node.parentNode;
  while (current !== null) {
    if (current === parent) {
      return true;
    }
    current = current.parentNode;
  }
  return false;
};

export const getObjDifferenceByKeys = (obj2, obj1) =>
  omitBy(obj2, (value, key) => isEqual(value, obj1[key]));

export const getUnionObjDifferenceByKeys = (obj2 = {}, obj1 = {}) => {
  const diffKeys = new Set();

  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  allKeys.forEach((key) => {
    if (obj1[key] !== obj2[key]) {
      diffKeys.add(key);
    }
  });

  return Array.from(diffKeys);
};

export const formatToLocalTime = (
  timestamp: number | string | null,
): string => {
  if (!timestamp) return 'null';
  const date = new Date(timestamp);
  return date.toLocaleString();
};

/*
 *
 ** ************************************************************************************ **
 *                             App Utils Functions Start
 */

export const getAppOrigin = () => window.location.origin;

//  gives location origin + pathname
export const getAppBaseUrl = () => window.location.href.split('#')[0];

export const getAppLocationInfo = (url = window.location.href) => {
  if (!url) {
    return { hash: ' ', query: '' };
  }
  const [hash, query] = url.split('#')[1]?.split('?') ?? ['', ''];
  return { hash, query };
};

export const getAppSearchParams = (url = window.location.href) => {
  const { query } = getAppLocationInfo(url);
  return query ? Object.fromEntries(new URLSearchParams(query)) : {};
};

export const getAppRootElement = () =>
  (document.getElementById(window.rootId || 'root') as HTMLElement) ||
  document.getElementsByTagName('body')?.[0];

export const getAppDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (
    /mobile|android|iphone|ipad|ipod|blackberry|mini|windows\sce|palm/i.test(
      userAgent,
    )
  ) {
    if (
      /ipad|tablet|playbook|silk/i.test(userAgent) ||
      (/\btablet\b/.test(userAgent) && !/phone/i.test(userAgent))
    ) {
      return 'Tablet';
    }
    return 'Mobile';
  }
  return 'Desktop';
};

export const getAppPlatform = () => {
  if (window.isWebPlatform) {
    return 'platform';
  }
  return window?.hostApp?.platform as string;
};

export const isWebPlatform = () => window.isWebPlatform;

export const isIOSPlatform = () => getAppPlatform() === 'ios';

export const isAndroidPlatform = () => getAppPlatform() === 'android';

export const isNativeMobileApp = () => isIOSPlatform() || isAndroidPlatform();

export const isLmsWeb = () => getAppPlatform() === 'web';
export const isSelfServe = () => getAppPlatform() === 'selfserve';

export const isMobile = () => getAppDeviceType() === 'Mobile';
export const isTablet = () => getAppDeviceType() === 'Tablet';
export const isDesktop = () => getAppDeviceType() === 'Desktop';

/*
 *                         App Utils Functions End
 ** ************************************************************************************ **
 *
 */

export const back = () =>
  !window.isWebPlatform
    ? window?.hostApp?.back
    : // eslint-disable-next-line no-restricted-globals
      history.back;
export const reload = () =>
  !window.isWebPlatform
    ? window?.hostApp?.reload
    : // eslint-disable-next-line no-restricted-globals
      location.reload;

export const getPortalConfigData = () => {
  const configData = JSON.parse(
    window.localStorage.getItem('portalConfig') ?? '{}',
  );
  return configData;
};

export const getClientConfigData = () => {
  // using config provided by hostapp (ios , android , lms web , selfserve)
  if (window?.hostApp?.getClientConfig) {
    return window?.hostApp?.getClientConfig();
  }

  // using config saved in local storage for vymo web + selfserve ,
  // would be used by form componnets where we do not render platform as iframe in hostApp
  const clientId = window.localStorage.getItem('client');
  if (!clientId) {
    return {};
  }

  const encryptedConfigData = window.localStorage.getItem('config') ?? '';

  const configData = encryptedConfigData
    ? decrypt(encryptedConfigData, `${clientId}_VYMO`)
    : {};

  if (!configData.auth_token) {
    log.error('Not Login. Client Auth Token not available.');
    return null;
  }

  return configData;
};

export const navigate = (
  route,
  pathParams?: Record<string, string> | undefined,
  query?,
) =>
  !window.isWebPlatform
    ? window?.hostApp?.navigate(route, pathParams, query)
    : // @ts-ignore
      reactRouteNavigate(route, query, pathParams);

export const getModuleProps = () =>
  !window.isWebPlatform ? window?.hostApp?.moduleProps ?? {} : {};

export const getHostAppLocation = () =>
  !window.isWebPlatform ? window?.hostApp?.location : null;

export const getVisitorToken = () =>
  !window.isWebPlatform
    ? window?.hostApp?.visitorToken
    : new Error('visitorToken not available in web platform');

export const closePortal = (
  isInit?: boolean,
  isInitSession?: boolean,
  authToken?: string,
) =>
  !window.isWebPlatform
    ? window?.hostApp?.closePortal?.(isInit, isInitSession, authToken)
    : new Error('closePortal not available in web platform');

export const getLocaleCountryCode = () => {
  const userLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  const countryCode = userLocale.split('-').pop();
  return countryCode;
};

export const setCookie = (name: string, value: string, days?: number) => {
  let expires = '';

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
    expires = `; expires=${date.toUTCString()}`; // Set expiration date
  }

  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
};

export const setAppRouteParams = (
  replace = false,
  hash = getAppLocationInfo().hash,
  query = getAppLocationInfo().query,
) => {
  const updatedUrlHash = `#${hash}${query ? `?${query}` : ''}`;
  if (isWebPlatform() || isLmsWeb() || isSelfServe()) {
    if (replace) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search + updatedUrlHash,
      );
    } else {
      window.location.hash = updatedUrlHash;
    }
  }
  // if (replace) {
  //   window.parent.history.replaceState(
  //     null,
  //     '',
  //     window.parent.location.pathname +
  //       window.parent.location.search +
  //       updatedUrlHash,
  //   );
  // } else {
  //   window.parent.location.hash = updatedUrlHash;
  // }
};

const getDebugMode = (): 'sol' | 'dev' | any => {
  if (!['production', 'preProd'].includes(process.env.APP_ENV || '')) {
    const params = getAppSearchParams();
    return params.debug;
  }

  return '';
};

export const isSolnDebugMode = () => getDebugMode() === 'sol';

export const isDevDebugMode = () => getDebugMode() === 'dev';

export const getKeyFromCookie = (key) => {
  const cookieArr = document.cookie.split(';');

  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split('=');

    if (cookiePair[0].trim() === key) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
};

export const isDev = () => process.env.NODE_ENV === 'development';

export const base64ToFile = (
  base64String = '',
  fileName = `${Math.random()}`,
) => {
  const [prefix, base64Content] = base64String.split(',');
  const mimeType =
    prefix.match(/data:(.*);base64/)?.[1] || 'application/octet-stream';

  const byteString = base64Content ? atob(base64Content) : '';
  const byteArray = Uint8Array.from(byteString, (char) => char.charCodeAt(0));

  return new File([byteArray], fileName, { type: mimeType });
};

export const getNavigationItems = () =>
  window.hostApp?.getNavigationItems?.() || [];

// TODO - moduleProps?.getUsersList? diretcly call in js file.
// data/business context cannot have func in this folder
export const getUsersList = (scope?: string) =>
  window.hostApp?.moduleProps?.getUsersList?.(scope) || {};

export const showLmsWebHeader = () =>
  Boolean(isLmsWeb() && getModuleProps()?.scenario !== 'login');

export const isWebInit = () =>
  Boolean(isLmsWeb() && !getModuleProps()?.isPortalLoggedIn());
