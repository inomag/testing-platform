/* eslint-disable complexity */
import React from 'react';
import { Text } from 'src/@vymo/ui/atoms';
import { Option, RadioGroup } from 'src/@vymo/ui/atoms/radio';
import TextArea from 'src/@vymo/ui/atoms/textArea';
import Label from 'src/@vymo/ui/molecules/form/vymoComponentsWithForm/label';
import { Editor } from '@monaco-editor/react';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { parse, transformInitialData } from './queries';
import styles from './index.module.scss';

export function FormulaFramework() {
  const [formula, setFormula] = React.useState({});
  const [type, setType] = React.useState('default / hidden / placeholder etc');
  const [formulaQuery, setFormulaQuery] = React.useState('');
  const [queryError, setQueryError] = React.useState('');

  const handleTypeOnChange = (value) => {
    setType(value?.[0]?.code);
    setFormula({});
    setFormulaQuery('');
    setQueryError('');
  };

  const handleFormulaChange = (value: string | undefined) => {
    let parsedValue = {};
    try {
      parsedValue = JSON.parse(value || '{}');
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
    const transformedData = transformInitialData(parsedValue);
    if (!transformedData.error) {
      setFormulaQuery(transformedData.query);
      setFormula(parsedValue);
    }
  };

  const handleQueryChange = (value: string | undefined) => {
    const parsedValue: any = parse(value);
    if (parsedValue?.error) {
      setQueryError(parsedValue?.error);
    }
    if (!parsedValue?.error && parsedValue?.value) {
      let query = parsedValue?.value;
      if (type === 'validations') {
        query = {
          expression: query,
          errorMessage: '',
        };
      } else {
        query = parsedValue?.value.function;
      }

      setFormula(query || formula);
      setQueryError('');
    }
    setFormulaQuery(value || '');
  };

  return (
    <div className={styles.formulaFramework}>
      <div className={styles.formulaFramework__queryWrapper}>
        <Text type="h4">
          {locale(Keys.TRANSLATE_SSUI_RULES_TO_FORMULA_CAPITAL)}
        </Text>
        <RadioGroup type="chipRadio" value={type} onChange={handleTypeOnChange}>
          <Option
            label={locale(Keys.DEFAULT)}
            value="default / hidden / placeholder etc"
          />
          <Option label={locale(Keys.VALIDATIONS)} value="validations" />
        </RadioGroup>
        <Text type="h3">
          {locale(Keys.PROVIDE_QUERY_FOR_TYPE_CASES, { type })}
        </Text>
        <div>
          {' '}
          <TextArea
            minLines={5}
            label={locale(Keys.QUERY)}
            placeholder={locale(Keys.CONDITION_EQUALS_EXAMPLE)}
            value={formulaQuery}
            onChange={handleQueryChange}
          />
          <Text variant="error" type="label">
            {queryError}
          </Text>
        </div>
        <Label
          html='For more info check <a href="https://teamvymo.atlassian.net/wiki/spaces/ENGG/pages/3028615267/Self+Serve+Formula+Framework" target="_blank">Self Serve Formula Framework</a>'
          dataTestId="more-info-link"
        />
      </div>
      <div className={styles.formulaFramework__editorWrapper}>
        <Editor
          height="100%"
          defaultLanguage="json"
          value={JSON.stringify(formula, null, 4)}
          onChange={handleFormulaChange}
          theme="vs-dark"
          options={{
            autoDetectHighContrast: true,
            scrollBeyondLastLine: false,
            fontSize: 16,
          }}
        />
      </div>
    </div>
  );
}
