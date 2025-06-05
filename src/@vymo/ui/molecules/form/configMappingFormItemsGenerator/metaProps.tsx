import React, { useMemo } from 'react';
import {
  getDurationValue,
  getFieldOptions,
  getLabelByType,
  getMetaValue,
  getValidationByTypeAndFieldRegex,
  toCamelCaseKeys,
} from './queries';
import type { MetaProps as Props } from './types';

function MetaProps({ field, clientConfig, render }: Props) {
  const updatedFieldData = useMemo(() => {
    const mutatedConfig = toCamelCaseKeys({ ...field });
    const min = getMetaValue(
      ['min', 'minDate', 'multimediaOptions.min_files'],
      mutatedConfig,
    );
    const max = getMetaValue(
      ['max', 'maxDate', 'multimediaOptions.max_files'],
      mutatedConfig,
    );
    const minLength = getMetaValue(['minChars'], mutatedConfig);
    const maxLength = getMetaValue(['maxChars'], mutatedConfig);

    const options = getFieldOptions(
      getMetaValue(
        ['options', 'codeNameSpinnerOptions', 'sifgOptions', 'spinnerOptions'],
        mutatedConfig,
      ),
      field.type,
    );

    const additionalConfigData = {
      ...mutatedConfig?.countryCodes,
      ...mutatedConfig?.enableCountryCodeV2,
    };

    const metaConfig = {
      min,
      max,
      minLength,
      maxLength,
      options,
      disabled: getMetaValue(
        ['disabled', 'readOnly', 'readonly'],
        mutatedConfig,
      ),
      required: getMetaValue(['required', 'mandatory'], mutatedConfig),
      verified: getMetaValue(['meta?.verified'], mutatedConfig),
      secureValue: getMetaValue(['metaData.isMasked', 'masked'], mutatedConfig),
      label: getLabelByType(
        field.type,
        getMetaValue(['label', 'hint', 'name'], mutatedConfig),
        mutatedConfig.value || mutatedConfig.defaultValue,
      ),
      charactersPerLine: getMetaValue(['maxLines'], mutatedConfig),
      duration: getDurationValue(options as any, field.type),
      validations: [
        ...getValidationByTypeAndFieldRegex(
          field.type,
          field.hint,
          mutatedConfig.regex,
          mutatedConfig.regexHint,
          minLength,
          maxLength,
          additionalConfigData,
        ),
        ...(getMetaValue(['validations'], mutatedConfig) || []),
      ],
      html: mutatedConfig.value,
      i18nConfig: clientConfig?.i18n_config || clientConfig?.i18nSettings,
    };
    return { ...mutatedConfig, ...metaConfig };
  }, [clientConfig?.i18nSettings, clientConfig?.i18n_config, field]);

  return render?.(updatedFieldData) ?? null;
}

// @ts-ignore
export default React.memo(MetaProps);
