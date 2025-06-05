import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Select, Switch, Text } from 'src/@vymo/ui/atoms';
import MultiTagInput from 'src/@vymo/ui/atoms/tagInput';
import Form from 'src/@vymo/ui/molecules/form';
import FormItem from 'src/@vymo/ui/molecules/form/formItem';
import { Editor } from '@monaco-editor/react';
import { ReactComponent as CloseIcon } from 'src/assets/icons/close.svg';
import { ReactComponent as EditIcon } from 'src/assets/icons/edit.svg';
import useContainerSize from 'src/hooks/useContainerSize';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { getProjectConfig } from '../../selectors';
import { setTemplateApiConfigPath } from '../../slice';
import { getComponentProps } from '../queries';
import {
  convertToSelectOptions,
  filterSortItems,
  getDefaultValues,
  getPropValueForSelect,
} from './queries';
import styles from './index.module.scss';

function DynamicComponent({ onChange, value, ...data }) {
  const dispatch = useAppDispatch();
  const { name } = data;
  const projectConfig = useAppSelector(getProjectConfig);

  const onChangeConfigProp = (selectValue) => {
    const configProp = selectValue[0]?.id;
    onChange({ ...value, path: `{{${configProp}}}` });
  };

  const onChangeUiQuery = (editorValue) => {
    onChange({ ...value, query: editorValue });
  };

  const onChangeSaveQuery = (editorValue) => {
    onChange({ ...value, saveQuery: editorValue });
  };

  const [bindType, selectValueProp] = useMemo(() => {
    const match = value?.path?.match(/\{\{(.*?)\}\}/);
    if (match) {
      return match[1].split('__');
    }
    return [];
  }, [value]);

  useEffect(() => {
    if (bindType === 'dataObject') {
      dispatch(setTemplateApiConfigPath([selectValueProp]));
      if (value.query || value.saveQuery) {
        onChange({ path: value.path });
      }
    }
  }, [bindType, dispatch, onChange, selectValueProp, value]);

  return (
    <>
      <Text type="label">{locale(Keys.PROPERTY_TO_BIND)}</Text>
      <Select
        options={convertToSelectOptions(projectConfig, name === 'options')}
        onChange={onChangeConfigProp}
        value={selectValueProp}
      />

      {bindType === 'formConfig' && (
        <>
          <Text type="label">{locale(Keys.ENTER_UI_QUERY)}</Text>
          <Editor
            width="400px"
            height="200px"
            defaultLanguage="javascript"
            value={value?.query}
            theme="vs-dark"
            options={{
              autoDetectHighContrast: true,
              scrollBeyondLastLine: false,
              fontSize: 16,
            }}
            onChange={onChangeUiQuery}
          />

          {name === 'value' && (
            <>
              <Text type="label">{locale(Keys.ENTER_SAVE_QUERY)}</Text>
              <Editor
                width="400px"
                height="200px"
                defaultLanguage="javascript"
                value={value?.saveQuery}
                theme="vs-dark"
                options={{
                  autoDetectHighContrast: true,
                  scrollBeyondLastLine: false,
                  fontSize: 16,
                }}
                onChange={onChangeSaveQuery}
              />
            </>
          )}
        </>
      )}
    </>
  );
}

function FormItemComponent(props) {
  const { onChange, value, type, name, options } = props;
  const [isStatic, setIsStatic] = useState(!value?.path);

  // Hook declarations at the top level
  const renderInput = useCallback(() => {
    let inputComponent: JSX.Element = (
      <Input onChange={onChange} value={value} />
    );

    if (name === 'value') {
      return inputComponent;
    }

    if (type === 'enum-literal') {
      inputComponent = (
        <Select
          options={getPropValueForSelect(options)}
          onChange={onChange}
          value={value}
        />
      );
    } else if (type === 'boolean') {
      inputComponent = <Switch onChange={onChange} value={value} />;
    } else if (type === 'number') {
      inputComponent = (
        <Input type="number" onChange={onChange} value={value} />
      );
    } else if (type === 'array') {
      inputComponent = <MultiTagInput onChange={onChange} value={value} />;
    }

    return inputComponent;
  }, [type, name, options, value, onChange]);

  const onClickEdit = useCallback(() => {
    const isStaticValue = !isStatic;
    setIsStatic(isStaticValue);
    if (!isStaticValue) {
      onChange({
        path: '',
        query: 'const query = (data, formData)=>{ return data;}',
        saveQuery: 'const saveQuery = (data, formData)=>{ return data;}',
      });
    } else {
      onChange();
    }
  }, [isStatic, onChange]);

  // For regular fields, show edit button and handle static/dynamic switch
  return (
    <>
      <Button
        className={styles.rightPane__form__formItem__button}
        type="text"
        onClick={onClickEdit}
        iconProps={{ icon: <EditIcon />, iconPosition: 'left' }}
      />

      {isStatic ? (
        renderInput()
      ) : (
        <DynamicComponent
          onChange={onChange}
          type={type}
          name={name}
          options={options}
          value={value}
        />
      )}
    </>
  );
}

function RightPane({ selectedNode, setNodes, setShowRightPane }) {
  const { key, elementType, componentType, ...data } = selectedNode;

  const [containerRef, containerSize] = useContainerSize();

  const typeProps = getComponentProps(componentType, elementType);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const getFormItem = useCallback((data) => {
    const { name, type, mandatory, options } = data;

    const commonProps = {
      label: name,
      code: name,
      required: mandatory,
      classNames: `${styles.rightPane__form__formItem} ${styles.rightPane__form__formItem__span}`,
    };

    if (type === 'boolean') {
      commonProps.classNames = styles.rightPane__form__formItem;
    } else if (type === 'number') {
      commonProps.classNames = styles.rightPane__form__formItem;
    }

    return (
      <FormItem {...commonProps}>
        <FormItemComponent
          name={name}
          type={type}
          value={data.value}
          options={options}
        />
      </FormItem>
    );
  }, []);

  if (!elementType) {
    return null;
  }

  return (
    <div
      className={styles.rightPane}
      ref={containerRef}
      style={{ height: containerSize.height }}
    >
      <div>
        <CloseIcon
          className={styles.rightPane__close}
          onClick={() => setShowRightPane(false)}
        />
        <Text type="h3">
          {locale(Keys.PROPS_UI_ELEMENT_TYPE, { elementType })}
        </Text>
      </div>

      <Form
        name="uiBuilderForm"
        key={elementType}
        className={styles.rightPane__form}
        onChange={(formData) => {
          // Recursively transform form values at any depth
          const transformValue = (val: any): any => {
            // Base cases
            if (!val || typeof val !== 'object') return val;
            if (Array.isArray(val)) return val[0]?.value ?? val[0];

            // Handle nested object
            return Object.entries(val).reduce((acc, [k, v]) => {
              // If v has a value property, transform that
              if (v && typeof v === 'object' && 'value' in v) {
                acc[k] = transformValue(v.value);
              }
              // If v is an object but doesn't have value prop, transform the object itself
              else if (v && typeof v === 'object') {
                acc[k] = transformValue(v);
              }
              // For primitive values
              else {
                acc[k] = v;
              }
              return acc;
            }, {});
          };

          // Apply transformation
          formData = Object.entries(formData).reduce((acc, [k, v]) => {
            acc[k] = transformValue(v?.value);
            return acc;
          }, {});

          setNodes((nds) =>
            nds.map((node) => {
              node = { ...node };
              if (node.id === key) {
                node.data = { ...node.data, ...formData };
              }
              return node;
            }),
          );
        }}
        value={getDefaultValues(data)}
      >
        {filterSortItems(typeProps).map((item) => getFormItem(item))}
      </Form>
    </div>
  );
}

export default RightPane;
