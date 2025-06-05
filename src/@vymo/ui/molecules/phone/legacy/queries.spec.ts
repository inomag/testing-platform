import { getLabelsByLocale } from './queries';

describe('getLabelsByLocale', () => {
  const countryCodes = [
    'ar',
    'cz',
    'de',
    'el',
    'en',
    'es',
    'fi',
    'fr',
    'he',
    'hy',
    'it',
    'ja',
    'nb',
    'nl',
    'pl',
    'pt',
    'ru',
    'sk',
    'sv',
    'tr',
    'ua',
    'vi',
    'zh',
  ];

  test.each(countryCodes)('%s', async (locale) => {
    const labels = await getLabelsByLocale(locale);
    expect(labels).toBeDefined();
  });

  it('should return default labels for invalid locale code "xx"', async () => {
    const labels = await getLabelsByLocale('xx');
    expect(labels).toEqual(expect.any(Object));
  });
});
