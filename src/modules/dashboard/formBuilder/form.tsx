import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Text } from 'src/@vymo/ui/atoms';
import { Form } from 'src/@vymo/ui/molecules';
import { FormValid } from 'src/@vymo/ui/molecules/form/formProvider/types';
import { FormattedField, FormVersion } from 'src/@vymo/ui/molecules/form/types';
import { Editor } from '@monaco-editor/react';
import { ReactComponent as NotFound } from 'src/assets/icons/notFound.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import styles from './index.module.scss';

function FormComponent({
  config,
  configErrors,
}: {
  config: any;
  configErrors: string;
}) {
  const formRef = useRef(null);
  const [formResponse, setFormResponse] = useState<{
    valid?: FormValid;
    data?: FormattedField[];
  }>({});
  const valueMap = useMemo(
    () =>
      config?.fields?.reduce((result, input) => {
        result[input.code] = { value: input.value };
        return result;
      }, {}) || {},
    [config],
  );

  const onFormSubmit = useCallback(async () => {
    // @ts-ignore
    const result = await formRef.current?.getFieldsForSubmission?.();
    setFormResponse(result);
  }, []);

  return (
    <div className={styles.formBuilder__formWrapper}>
      <div className={styles.formBuilder__formWrapper__formDiv}>
        <div className={styles.formBuilder__formWrapper__formDiv__header}>
          <Text type="h4">{locale(Keys.SAMPLE_FORM)}</Text>{' '}
          <Button size="large" onClick={onFormSubmit}>
            {locale(Keys.SUBMIT_CAPITAL)}
          </Button>
        </div>

        {configErrors ? (
          <Text
            classNames={styles.formBuilder__formWrapper__formDiv__error}
            variant="error"
          >
            {configErrors}
          </Text>
        ) : (
          <div
            style={{
              height: '100%',
              boxShadow: 'inset 0 0 4px rgba(0, 0, 0, 0.1)',
              borderRadius: 'var(--radius-l-16)',
            }}
          >
            {config?.fields?.length ? (
              <Form
                // @ts-ignore
                ref={formRef}
                id="testForm"
                name="testForm"
                span="1fr"
                onChange={(formFields) => {
                  // eslint-disable-next-line no-console
                  console.log(formFields);
                }}
                config={{
                  version: FormVersion.web,
                  // @ts-ignore
                  data: config.fields || [],
                  grouping: [],
                  fieldItemConfig: {
                    showDisabledIcon: true,
                  },
                  beforeSaveHookConfig: {
                    multimedia: {
                      uploadUrl: `/portal/recruitment/generate_signed_urls?portalId=abc-recruitment-portal`,
                      isMultimediaBeforeSaveHookDisabled: false,
                    },
                  },
                }}
                value={valueMap}
                formulaContext={{
                  data: {
                    session: config?.formulaContext?.session || {},
                    vo: config?.formulaContext?.vo || {},
                  },
                }}
              />
            ) : (
              <div className={styles.formBuilder__formWrapper__noFields}>
                <NotFound />
                <Text type="h3">
                  {locale(Keys.NO_FIELDS_TO_DISPLAY_CAPITAL)}
                </Text>
              </div>
            )}
          </div>
        )}
      </div>
      {formResponse?.valid === 'valid' && (
        <div className={styles.formBuilder__formWrapper__responseEditor}>
          <Editor
            height="100%"
            defaultLanguage="json"
            value={JSON.stringify(
              { inputs: formResponse?.data || [] },
              null,
              4,
            )}
            theme="vs-dark"
            loading={locale(Keys.LOADING_CONFIG_EDITOR)}
            options={{
              autoDetectHighContrast: true,
              scrollBeyondLastLine: false,
              fontSize: 16,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default FormComponent;
