import { clearCookies, processConsentLabel } from './queries';

describe('Stepper queries', () => {
  describe('clearCookies', () => {
    beforeEach(() => {
      document.cookie = 'testCookie1=value1';
      document.cookie = 'testCookie2=value2';
    });

    it('should clear all cookies', () => {
      clearCookies();
      expect(document.cookie).toBe('');
    });

    it('should handle no cookies', () => {
      clearCookies();
      clearCookies();
      expect(document.cookie).toBe('');
    });

    it('should return the label if it does not contain any links', () => {
      expect(processConsentLabel({}, 'test')).toEqual([{ text: 'test' }]);
    });

    it('should return the label with the links processed if it contains any', () => {
      expect(
        processConsentLabel(
          {
            link1: {
              text: 'here',
              url: 'https://www.google.com',
              layout: 'dialog',
            },
            link2: {
              text: 'here',
              url: 'https://www.test.com',
              layout: 'dialog',
            },
          },
          'I agree to terms and conditions mentioned {{link1}} and {{link2}}',
        ),
      ).toEqual([
        { text: 'I agree to terms and conditions mentioned ' },
        {
          text: 'here',
          link: 'https://www.google.com',
          bold: true,
          layout: 'dialog',
        },
        { text: ' and ' },
        {
          text: 'here',
          link: 'https://www.test.com',
          bold: true,
          layout: 'dialog',
        },
        { text: '' },
      ]);
    });

    it('should return the label with the links processed if it contains any, and also if the link is not defined', () => {
      expect(processConsentLabel({}, 'test {{test}}')).toEqual([
        { text: 'test ' },
        { text: '{{test}}', link: undefined, bold: true, layout: '' },
        { text: '' },
      ]);
    });
  });
});
