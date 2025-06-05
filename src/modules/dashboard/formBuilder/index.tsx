/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { Button, Text } from 'src/@vymo/ui/atoms';
import { List, Popup } from 'src/@vymo/ui/blocks';
import Editor from '@monaco-editor/react';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { commonConfig, inputSpecificConfig, inputTypes } from './constant';
import Form from './form';
import { generateRandomCode, generateRandomHint } from './utils';
import styles from './index.module.scss';

export interface FormBuilderProps {
  formConfig: any;
  setFormConfig: (config: any) => void;
}

export function FormBuilder({ formConfig, setFormConfig }: FormBuilderProps) {
  const [formConfigErrors, setFormConfigErrors] = useState('');

  const validateConfig = (config: any) => {
    if (!config || typeof config !== 'object') {
      return locale(Keys.CONFIG_SHOULD_BE_AN_OBJECT);
    }
    if (!config.fields || !Array.isArray(config.fields)) {
      return locale(Keys.ERROR_FIELDS_PROPERTY_INVALID);
    }
    return '';
  };

  const handleEditorChange = (value: string | undefined) => {
    let parsedValue: any = {};
    let errors = '';

    try {
      parsedValue = JSON.parse(value || '{}');
      errors = validateConfig(parsedValue);
    } catch (e: any) {
      errors = e?.message || locale(Keys.INVALID_JSON);
    }

    setFormConfigErrors(errors);
    if (!errors) {
      setFormConfig(parsedValue);
    }
  };

  const setSampleField = (field: { key: string; name: string }) => {
    const newFields: any = [];
    newFields.push({
      ...commonConfig,
      ...inputSpecificConfig[field.key],
      code: generateRandomCode(),
      hint: generateRandomHint(field.name),
      type: field.key,
    });
    handleEditorChange(
      JSON.stringify(
        { ...formConfig, fields: [...(formConfig.fields || []), ...newFields] },
        null,
        4,
      ),
    );
  };

  return (
    <div className={styles.formBuilder}>
      <div className={styles.formBuilder__editContainer}>
        <div className={styles.formBuilder__editContainer__buttons}>
          <Popup
            closeTrigger="click"
            content={
              <List onItemClick={(idx) => setSampleField(inputTypes[idx])}>
                {inputTypes.map((input) => (
                  <List.Item>{input.name}</List.Item>
                ))}
              </List>
            }
          >
            <Button>{locale(Keys.SAMPLE_CONFIG_CAPITAL)}</Button>
          </Popup>
          <Button onClick={() => setFormConfig({ ...formConfig, fields: [] })}>
            {locale(Keys.RESET_CAPITAL)}
          </Button>
        </div>
        <Text>{locale(Keys.FORM_CONFIG_DESCRIPTION)}</Text>
        <div className={styles.formBuilder__codeEditor}>
          <Editor
            height="100%"
            defaultLanguage="json"
            value={JSON.stringify(formConfig, null, 4)}
            theme="vs-dark"
            onChange={handleEditorChange}
            loading={locale(Keys.LOADING_CONFIG_EDITOR)}
            options={{
              autoDetectHighContrast: true,
              scrollBeyondLastLine: false,
              fontSize: 16,
            }}
          />
        </div>
      </div>
      <Form config={formConfig} configErrors={formConfigErrors} />
    </div>
  );
}
