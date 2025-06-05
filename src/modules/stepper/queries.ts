import { mockFlows, MockState } from './constants';

let mockStep = 0;

let mockFlow: keyof typeof mockFlows = 'loginFlowNtb';

export const setMockFlow = (flow: keyof typeof mockFlows) => {
  mockFlow = flow;
  return mockFlows[mockFlow][mockStep] as MockState;
};
export const getNextMockState = () => {
  mockStep += 1;
  return mockFlows[mockFlow][mockStep] as MockState;
};

export const clearCookies = () => {
  const cookies = document.cookie.split(';');

  cookies.forEach((cookie) => {
    const name: string = cookie.split('=')[0].trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  });
};

export const processConsentLabel = (links, label) => {
  const parts = label.split(/({{[^}]+}})/);
  if (parts.length === 0) {
    return label;
  }

  const processedParts = parts.map((part) => {
    if (links && part.match(/{{[^}]+}}/)) {
      const key = part.replace(/{{|}}/g, '');
      const linkData = links[key] || {};
      return {
        text: linkData.text || part,
        link: linkData.url,
        bold: true,
        layout: linkData.layout || '',
      };
    }
    return { text: part };
  });
  return processedParts.map((part) => ({ ...part }));
};
