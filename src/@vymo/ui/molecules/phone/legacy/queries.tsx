// eslint-disable-next-line complexity
export const getLabelsByLocale = async (localeCode) => {
  let labels;
  switch (localeCode) {
    case 'ar':
      labels = await import('react-phone-number-input/locale/ar.json');
      return labels.default;
    case 'cz':
      labels = await import('react-phone-number-input/locale/cz.json');
      return labels.default;
    case 'de':
      labels = await import('react-phone-number-input/locale/de.json');
      return labels.default;
    case 'el':
      labels = await import('react-phone-number-input/locale/el.json');
      return labels.default;
    case 'en':
      labels = await import('react-phone-number-input/locale/en.json');
      return labels.default;
    case 'es':
      labels = await import('react-phone-number-input/locale/es.json');
      return labels.default;
    case 'fi':
      labels = await import('react-phone-number-input/locale/fi.json');
      return labels.default;
    case 'fr':
      labels = await import('react-phone-number-input/locale/fr.json');
      return labels.default;
    case 'he':
      labels = await import('react-phone-number-input/locale/he.json');
      return labels.default;
    case 'hy':
      labels = await import('react-phone-number-input/locale/hy.json');
      return labels.default;
    case 'it':
      labels = await import('react-phone-number-input/locale/it.json');
      return labels.default;
    case 'ja':
      labels = await import('react-phone-number-input/locale/ja.json');
      return labels.default;
    case 'nb':
      labels = await import('react-phone-number-input/locale/nb.json');
      return labels.default;
    case 'nl':
      labels = await import('react-phone-number-input/locale/nl.json');
      return labels.default;
    case 'pl':
      labels = await import('react-phone-number-input/locale/pl.json');
      return labels.default;
    case 'pt':
      labels = await import('react-phone-number-input/locale/pt.json');
      return labels.default;
    case 'ru':
      labels = await import('react-phone-number-input/locale/ru.json');
      return labels.default;
    case 'sk':
      labels = await import('react-phone-number-input/locale/sk.json');
      return labels.default;
    case 'sv':
      labels = await import('react-phone-number-input/locale/sv.json');
      return labels.default;
    case 'tr':
      labels = await import('react-phone-number-input/locale/tr.json');
      return labels.default;
    case 'ua':
      labels = await import('react-phone-number-input/locale/ua.json');
      return labels.default;
    case 'vi':
      labels = await import('react-phone-number-input/locale/vi.json');
      return labels.default;
    case 'zh':
      labels = await import('react-phone-number-input/locale/zh.json');
      return labels.default;
    default:
      labels = await import('react-phone-number-input/locale/en.json');
      return labels.default;
  }
};
