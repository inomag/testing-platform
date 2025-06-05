import leven from 'leven';

export const getSearchResultsForComponents = (components, searchString) => {
  const results = {};

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const category in components) {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in components[category]) {
      const distance = leven(key.toLowerCase(), searchString.toLowerCase());
      if (distance <= key.length - searchString.length) {
        if (!results[category]) results[category] = {};
        results[category][key] = components[category][key];
      }
    }
  }

  return results;
};
