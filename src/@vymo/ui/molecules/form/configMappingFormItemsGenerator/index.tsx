import _ from 'lodash';
import React, { useCallback, useRef } from 'react';
import { Switch } from 'src/@vymo/ui/atoms';
import Input from 'src/@vymo/ui/atoms/input';
import Text from 'src/@vymo/ui/atoms/text';
import TextArea from 'src/@vymo/ui/atoms/textArea';
import { Collapsible } from 'src/@vymo/ui/blocks';
import CodeEditor from 'src/@vymo/ui/blocks/codeEditor';
import DocumentUploaderAdapter from 'src/@vymo/ui/molecules/form/adapters/documentUploaderAdapter';
import Aadhar from 'src/@vymo/ui/molecules/identification/aadhar';
import Pan from 'src/@vymo/ui/molecules/identification/pan';
import classnames from 'classnames';
import CodeNameSpinner from '../adapters/codeNameSpinner';
import CurrencyAndDecimalInput from '../adapters/currencyDecimalAdpater';
import DatePickerAdapter from '../adapters/datePickerAdapter';
import DateTimeRangePickerAdapter from '../adapters/dateRangeTimePickerAdapter';
import LocationAdapter from '../adapters/locationAdapter';
import MultiSelectAdapter from '../adapters/multiSelectAutoCompleteAdapter';
import PhoneAdapter from '../adapters/phoneAdapter';
import RadioGroupAdapter from '../adapters/radioAdapter';
import TimePickerAdapter from '../adapters/timePickerAdapter';
import FormItem from '../formItem';
import { useFormContext } from '../formProvider';
import { InputFieldConfig } from '../types';
import Aif from '../vymoComponentsWithForm/aif';
import Group from '../vymoComponentsWithForm/group';
import Label from '../vymoComponentsWithForm/label';
import Link from '../vymoComponentsWithForm/link';
import OifWrapper from '../vymoComponentsWithForm/oifWrapper';
import ReferralDropdown from '../vymoComponentsWithForm/referralDropdown';
import Sifg from '../vymoComponentsWithForm/sifg';
import ContextManager from './contextManager';
import FormDebugger from './formDebugger';
import FormulaContext from './formulaContext';
import FormulaEvaluator from './formulaContext/formulaEvaluator';
import MetaProps from './metaProps';
import { isDropdownType } from './queries';
import { ConfigMappingFormItemsGeneratorProps } from './types';
import styles from '../index.module.scss';

function ConfigMappingFormItemsGenerator({
  formValue,
  formulaContext,
  span,
}: React.PropsWithChildren<ConfigMappingFormItemsGeneratorProps>) {
  const { groupedConfig, clientConfig, isDebug, config } =
    useFormContext(false);
  let inputElement: any = null;

  const hiddenFields = useRef<string[]>([]);

  const getInputType = useCallback(
    // eslint-disable-next-line complexity
    ({ type, ...field }: Partial<InputFieldConfig>, code, hint, children) => {
      const showDisabledIcon = Boolean(
        config?.fieldItemConfig?.showDisabledIcon,
      );
      const { viewMode = false } = config;
      switch (type) {
        case 'text':
        case 'number':
        case 'input':
          inputElement = (
            // @ts-ignore
            // eslint-disable-next-line react-hooks/exhaustive-deps
            <Input
              {..._.omit(field, 'label')}
              type={type === 'number' ? 'number' : 'text'}
              showDisabledIcon={showDisabledIcon}
              viewMode={viewMode}
              showSecureValueIcon={false}
            />
          );
          break;
        case 'pan':
          inputElement = (
            // @ts-ignore
            <Pan
              {..._.omit(field, 'label')}
              showDisabledIcon={showDisabledIcon}
              viewMode={viewMode}
            />
          );
          break;
        case 'aadhar':
          inputElement = (
            // @ts-ignore
            <Aadhar
              {..._.omit(field, 'label')}
              showDisabledIcon={showDisabledIcon}
              viewMode={viewMode}
            />
          );
          break;
        case 'spinner':
        case 'code_name_spinner':
          inputElement = (
            // @ts-ignore
            <CodeNameSpinner
              {...field}
              type={type}
              showDisabledIcon={showDisabledIcon}
              viewMode={viewMode}
            />
          );
          break;

        case 'multi_select_check_box_user':
        case 'multi_select_auto_complete':
          inputElement = (
            <MultiSelectAdapter
              {...field}
              // @ts-ignore
              type={type}
              showDisabledIcon={showDisabledIcon}
              viewMode={viewMode}
            />
          );
          break;

        case 'phone':
          inputElement = (
            // @ts-ignore
            <PhoneAdapter
              {...field}
              showDisabledIcon={showDisabledIcon}
              viewMode={viewMode}
            />
          );
          break;
        case 'date':
          // @ts-ignore
          inputElement = (
            // @ts-ignore
            <DatePickerAdapter
              {...field}
              showDisabledIcon={showDisabledIcon}
              viewMode={viewMode}
            />
          );
          break;

        case 'time':
          inputElement = (
            <TimePickerAdapter
              {...field}
              // @ts-ignore
              showDisabledIcon={showDisabledIcon}
              viewMode={viewMode}
            />
          );
          break;

        case 'meeting':
          inputElement = (
            <DateTimeRangePickerAdapter
              {...field}
              // @ts-ignore
              showDisabledIcon={showDisabledIcon}
              viewMode={viewMode}
            />
          );
          break;

        case 'user_referral':
        case 'referral':
          inputElement = (
            // @ts-ignore
            <ReferralDropdown
              {...field}
              showDisabledIcon={showDisabledIcon}
              viewMode={viewMode}
            />
          );
          break;

        case 'sifg':
          inputElement = (
            // @ts-ignore
            <Sifg
              {...field}
              showDisabledIcon={showDisabledIcon}
              viewMode={viewMode}
            />
          );
          break;

        case 'location':
          inputElement = (
            // @ts-ignore
            <LocationAdapter
              {..._.omit(field, 'hint', 'label')}
              showDisabledIcon={showDisabledIcon}
              viewMode={viewMode}
            />
          );
          break;

        case 'aif':
          return (
            // @ts-ignore
            <Aif {...field} viewMode={viewMode}>
              {children}
            </Aif>
          );

        case 'group':
          return (
            // @ts-ignore
            <Group {...field}>{children}</Group>
          );

        case 'currency':
          inputElement = (
            // @ts-ignore
            <CurrencyAndDecimalInput
              {..._.omit(field, 'label')}
              isCurrency
              showDisabledIcon={showDisabledIcon}
              viewMode={viewMode}
            />
          );
          break;

        case 'decimal':
          inputElement = (
            // @ts-ignore
            <CurrencyAndDecimalInput
              {..._.omit(field, 'label')}
              showDisabledIcon={showDisabledIcon}
              viewMode={viewMode}
            />
          );
          break;

        case 'sentence':
          inputElement = (
            // @ts-ignore
            <TextArea {..._.omit(field, 'label')} viewMode={viewMode} />
          );
          break;

        case 'email':
          inputElement = (
            // @ts-ignore
            <Input
              {..._.omit(field, 'label')}
              type={type}
              showDisabledIcon={showDisabledIcon}
              viewMode={viewMode}
            />
          );
          break;
        case 'label':
          // @ts-ignore
          inputElement = <Label {...field} />;
          break;
        case 'link':
          // @ts-ignore
          inputElement = <Link {...field} />;
          break;
        case 'multimedia':
          inputElement = (
            // @ts-ignore
            <DocumentUploaderAdapter {..._.omit(field, 'label')} type={type} />
          );
          break;

        case 'radio':
          inputElement = (
            <RadioGroupAdapter
              {...field}
              // @ts-ignore
              showDisabledIcon={showDisabledIcon}
              viewMode={viewMode}
            />
          );
          break;

        case 'switch':
          // @ts-ignore
          inputElement = <Switch {...field} />;
          break;

        case 'codeEditor':
          // @ts-ignore
          inputElement = <CodeEditor {...field} />;
          break;

        default:
          // eslint-disable-next-line react/jsx-no-useless-fragment
          return (
            <Text
              bold
            >{`sorry, this ${hint} of type ${type} is not supported currently. Contact vymo frontend team for support`}</Text>
          );
      }

      if (
        (field?.oifOptions?.url ||
          ['otp', 'dpp'].includes(field?.oifOptions?.type as string)) &&
        !viewMode
      ) {
        return (
          // @ts-ignore
          <OifWrapper
            {...field}
            type={type}
            isElementDropdownType={isDropdownType(type)}
            customPayload={config?.customPayload}
          >
            {inputElement}
          </OifWrapper>
        );
      }

      return inputElement;
    },
    [JSON.stringify(config)],
  );

  const getFieldsToRender = (fields) =>
    fields.map(({ code, hint, tooltip, ...field }) =>
      !field.hideInDebug ? (
        <MetaProps
          key={code}
          clientConfig={clientConfig}
          field={{ code, hint, ...field }}
          render={(fieldMeta) => (
            <ContextManager
              field={fieldMeta}
              // @ts-ignore
              formValue={formValue}
              render={(updatedFieldMeta) => (
                <FormulaEvaluator
                  key={code}
                  clientConfig={clientConfig}
                  field={{ code, hint, ...updatedFieldMeta }}
                  // @ts-ignore
                  formValue={formValue}
                  render={(
                    evaluatedField,
                    updatedValue,
                    computedAdditionalData,
                  ) => {
                    if (evaluatedField.hidden) {
                      hiddenFields.current = [
                        ...new Set([...hiddenFields.current, code]),
                      ];
                    } else {
                      hiddenFields.current = _.without(
                        hiddenFields.current || [],
                        code,
                      );
                    }
                    return (
                      <FormItem
                        key={code}
                        code={code}
                        tooltip={tooltip}
                        label={updatedFieldMeta?.label}
                        value={updatedValue}
                        validations={evaluatedField?.validations}
                        hidden={evaluatedField?.hidden}
                        required={evaluatedField?.required}
                        verified={updatedFieldMeta?.verified}
                        min={evaluatedField?.min}
                        max={evaluatedField?.max}
                        type={evaluatedField?.type}
                        additionalData={computedAdditionalData}
                        hint={hint}
                      >
                        {getInputType(
                          evaluatedField,
                          code,
                          hint,
                          Array.isArray(evaluatedField.children) &&
                            !_.isEmpty(evaluatedField.children) ? (
                            getFieldsToRender(evaluatedField.children)
                          ) : (
                            // eslint-disable-next-line react/jsx-no-useless-fragment
                            <></>
                          ),
                        )}
                      </FormItem>
                    );
                  }}
                />
              )}
            />
          )}
        />
      ) : null,
    );

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const getGroupsToRender = (groupConfig) => (
    <div className={styles.form__groups}>
      {groupConfig.map((group) => {
        // eslint-disable-next-line testing-library/render-result-naming-convention
        const fieldsToRender = getFieldsToRender(group.fields);
        const { name, status } = group;

        const groupClassNames = classnames(
          config?.groupConfig?.collapsibleClasses,
          {
            [styles.form__groups__hidden]:
              group.fields?.every((field) =>
                hiddenFields.current.includes(field.code),
              ) || _.isEmpty(group.fields),
          },
        );

        return (
          <Collapsible
            key={name}
            title={name}
            open={
              status?.variant && status?.text
                ? status.variant !== 'success'
                : true
            }
            {...group}
            className={groupClassNames}
          >
            <div
              className={styles.form__groups__form}
              style={span ? { gridTemplateColumns: span } : {}}
            >
              {fieldsToRender}
            </div>
          </Collapsible>
        );
      })}
    </div>
  );

  return (
    <FormulaContext context={formulaContext} formValue={formValue}>
      <FormDebugger
        groupedConfig={groupedConfig}
        isDebug={isDebug}
        render={(filteredGroupedConfig) =>
          filteredGroupedConfig[0].code === 'default'
            ? getFieldsToRender(filteredGroupedConfig[0].fields)
            : getGroupsToRender(filteredGroupedConfig)
        }
      />
    </FormulaContext>
  );
}

export default React.memo(ConfigMappingFormItemsGenerator);
