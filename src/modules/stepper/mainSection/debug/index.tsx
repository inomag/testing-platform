/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Text } from 'src/@vymo/ui/atoms';
import { List, Popup } from 'src/@vymo/ui/blocks';
import { Editor } from '@monaco-editor/react';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppSelector } from 'src/store/hooks';
import { getPageData } from '../../selectors';
import { setTemplateData } from '../../slice';
import { componentConfigs, templateConfigs } from './constants';
import styles from './index.module.scss';

export function StepperDebug() {
  const pageData = useAppSelector((state) => getPageData(state));
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const onStepperDebugChange = (value) => {
    try {
      const parsedValue = JSON.parse(value || '{}');
      dispatch(setTemplateData(parsedValue || {}));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const setSampleConfig = (config) => {
    if (config.type === 'template') {
      dispatch(setTemplateData(config.data || {}));
    } else {
      dispatch(setTemplateData({ ...pageData, [config.key]: config.data }));
    }
  };

  return (
    <div className={styles.debug}>
      <Popup
        closeTrigger="click"
        popupClass={styles.debug__samplePopover}
        content={
          <div style={{ padding: '8px' }}>
            <Text bold>{locale(Keys.TEMPLATE)}</Text>
            <List onItemClick={(idx) => setSampleConfig(templateConfigs[idx])}>
              {templateConfigs.map((config) => (
                <List.Item>{config.name}</List.Item>
              ))}
            </List>
            <Text bold>{locale(Keys.COMPONENT)}</Text>
            <List onItemClick={(idx) => setSampleConfig(componentConfigs[idx])}>
              {componentConfigs.map((config) => (
                <List.Item>{config.name}</List.Item>
              ))}
            </List>
          </div>
        }
      >
        <Button>{locale(Keys.SAMPLE_CONFIGS)}</Button>
      </Popup>

      <Popup
        closeTrigger="outside"
        placement="bottom"
        content={
          <div className={styles.editor}>
            <span className={styles.editor__header}>
              {locale(Keys.TEMPLATE_CONFIG_CAPITAL)}
            </span>
            <Editor
              height="100%"
              defaultLanguage="json"
              value={JSON.stringify(pageData, null, 4)}
              theme="vs-dark"
              onChange={onStepperDebugChange}
              loading={locale(Keys.LOADING_CONFIG_EDITOR)}
              options={{
                autoDetectHighContrast: true,
                scrollBeyondLastLine: false,
                fontSize: 14,
                lineNumbers: 'off',
              }}
            />
          </div>
        }
      >
        <Button>{locale(Keys.UPDATE_CONFIG_CAPITAL)}</Button>
      </Popup>
    </div>
  );
}
