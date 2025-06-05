/* eslint-disable vymo-ui/restrict-import */
import React from 'react';
import Select from 'src/@vymo/ui/atoms/select';
import { changeLanguage, getCurrentLanguage } from 'src/i18n';
import { getLanguageOptions } from 'src/models/appConfig/selectors';
import { useAppSelector } from 'src/store/hooks';

function LanguageSelector() {
  const languageOptions = useAppSelector(getLanguageOptions);

  return (
    <Select
      data-test-id="select-language"
      options={languageOptions}
      value={getCurrentLanguage()}
      onChange={(option) => {
        const value = option?.[0]?.value ?? 'en';
        changeLanguage(value);
      }}
    />
  );
}

export default React.memo(LanguageSelector);
