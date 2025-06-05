import React from 'react';
import CurrencyAndDecimalInput from 'src/@vymo/ui/molecules/currencyAndDecimal';
import { CurrencyAndDecimalInputProps } from 'src/@vymo/ui/molecules/currencyAndDecimal/types';
import { DEFAULT_I18N_CONFIG } from '../constants';

type Props = Partial<CurrencyAndDecimalInputProps> & {
  i18nConfig: any;
  showDisabledIcon?: boolean;
  viewMode?: boolean;
};

function CurrencyAndDecimalAdapter({
  value,
  onChange,
  isCurrency,
  i18nConfig,
  viewMode = false,
  ...field
}: Props) {
  const {
    currency: currencySymbol,
    currency_iso: currencyIso,
    locale,
  } = i18nConfig ?? DEFAULT_I18N_CONFIG;
  return (
    <CurrencyAndDecimalInput
      value={value}
      //  @ts-ignore
      onChange={onChange}
      isCurrency={Boolean(isCurrency)}
      currencySymbol={currencySymbol}
      currencyIso={currencyIso}
      locale={locale}
      viewMode={viewMode}
      {...field}
    />
  );
}

export default CurrencyAndDecimalAdapter;
