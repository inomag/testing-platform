import React, { useEffect, useMemo, useState } from 'react';
import Select from 'src/@vymo/ui/atoms/select';
import { Option } from 'src/@vymo/ui/atoms/select/types';
import { useFormContext } from '../formProvider';
import styles from './index.module.scss';

type Props = {
  isDebug?: boolean;
  groupedConfig: any;
  render: any;
};

function FormDebugger({ isDebug, groupedConfig, render }: Props) {
  const { debugMessages } = useFormContext(false);
  const [selectedInputs, setSelectedInputs] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const [showDebug, setShowDebug] = useState<boolean>(true);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'h' && (event.metaKey || event.ctrlKey)) {
      setShowDebug(!showDebug);
    }
  });

  const fieldsData = useMemo(() => {
    const consolidatedFields: any[] = [];
    const uniqueFieldTypes = new Set();
    groupedConfig.forEach((formGroup) => {
      formGroup?.fields?.forEach((field) => {
        consolidatedFields.push(field);
        uniqueFieldTypes.add(field.type);
      });
    });
    const uniqueFieldTypesArray = Array.from(uniqueFieldTypes);
    return { fields: consolidatedFields, fieldTypes: uniqueFieldTypesArray };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(groupedConfig)]);

  const inputCodeOptions = useMemo(
    () =>
      fieldsData.fields.map((input) => ({
        value: input.code,
        label: input.hint,
      })),
    [fieldsData],
  );

  const inputTypeOptions = useMemo(
    () =>
      fieldsData.fieldTypes.map((input) => ({
        value: String(input),
        label: String(input),
      })),
    [fieldsData],
  );

  useEffect(() => {
    setSelectedInputs(fieldsData.fields.map((input) => input.code) || []);
  }, [fieldsData.fields]);

  useEffect(() => {
    setSelectedTypes(fieldsData.fieldTypes.map((input) => String(input)));
  }, [fieldsData.fieldTypes]);

  const filteredGroupedConfig = useMemo(() => {
    groupedConfig.forEach((formGroup) => {
      // Loop through each field in the form group
      formGroup.fields.forEach((field) => {
        if (
          !selectedInputs.includes(field.code) ||
          !selectedTypes.includes(field.type)
        ) {
          field.hideInDebug = true;
        } else {
          field.hideInDebug = false;
        }
      });
    });
    return groupedConfig;
  }, [groupedConfig, selectedInputs, selectedTypes]);

  return (
    <>
      {isDebug && (
        <div
          className={styles.formDebugger}
          style={{
            display: showDebug ? 'grid' : 'none',
          }}
        >
          <details>
            <summary className={styles.summary}>Form Inputs Controls</summary>
            <div style={{ display: 'grid' }}>
              <Select
                options={[
                  { value: 'allCodes', label: 'Select All' },
                  ...inputCodeOptions,
                ]}
                value={selectedInputs}
                disabled={false}
                search
                multi
                onChange={(options: Option[]) => {
                  if (options.find(({ value }) => value === 'allCodes')) {
                    setSelectedInputs(
                      (inputCodeOptions || []).map(({ value }) =>
                        String(value),
                      ),
                    );
                  } else {
                    setSelectedInputs(
                      (options || []).map(({ value }) => String(value)),
                    );
                  }
                }}
                clearInputIcon
                placeholder="Inputs Code Select"
              />
              <span style={{ marginTop: '8px' }} />
              <Select
                options={[
                  { value: 'allTypes', label: 'Select All' },
                  ...inputTypeOptions,
                ]}
                value={selectedTypes}
                disabled={false}
                search
                multi
                onChange={(options: Option[]) => {
                  if (options.find(({ value }) => value === 'allTypes')) {
                    setSelectedTypes(
                      (inputTypeOptions || []).map(({ value }) =>
                        String(value),
                      ),
                    );
                  } else {
                    setSelectedTypes(
                      (options || []).map(({ value }) => String(value)),
                    );
                  }
                }}
                clearInputIcon
                placeholder="Input Type Select"
              />
            </div>
          </details>

          <details>
            <summary className={styles.summary}>Form States & Values</summary>
            <div className={styles.valuesDiv}>
              {Object.keys(debugMessages)?.map((key) => (
                <details className={styles.valueDetailWrapper}>
                  <summary className={styles.valueSummaryWrapper}>
                    {key}{' '}
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          JSON.stringify(debugMessages[key]),
                        )
                      }
                    >
                      Copy
                    </button>
                  </summary>
                  <pre className={styles.valuePre}>
                    {JSON.stringify(debugMessages[key], null, 4)}
                  </pre>
                </details>
              ))}
            </div>
          </details>
        </div>
      )}
      {render?.(filteredGroupedConfig)}
    </>
  );
}

export default React.memo(FormDebugger);
