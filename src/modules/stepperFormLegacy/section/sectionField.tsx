import { noop } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { Country } from 'react-phone-number-input';
import { Checkbox, CheckboxGroup } from 'src/@vymo/ui/atoms/checkbox';
import Input from 'src/@vymo/ui/atoms/input';
import { Option, RadioGroup } from 'src/@vymo/ui/atoms/radio';
import { Option as OptionType } from 'src/@vymo/ui/atoms/radio/types';
import Select from 'src/@vymo/ui/atoms/select';
import Text from 'src/@vymo/ui/atoms/text';
import { DatePicker } from 'src/@vymo/ui/blocks/dateTime';
import FormItem from 'src/@vymo/ui/molecules/form/formItem';
import Aadhar from 'src/@vymo/ui/molecules/identification/aadhar';
import Pan from 'src/@vymo/ui/molecules/identification/pan';
import PhoneLegacy from 'src/@vymo/ui/molecules/phone/legacy';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { getCountry } from 'src/models/portalConfig/selectors';
import { DropdownValue } from 'src/models/stepperFormLegacy/types';
import { useAppSelector } from 'src/store/hooks';
import { INPUT_TYPE } from '../constants';
import { getDateObject, getFormattedDate } from '../queries';
import { SectionItemProp } from '../types';
import DocumentSection from './document';
import styles from '../index.module.scss';

function SectionField({ input, value, onChange = noop }: SectionItemProp) {
  const defaultCountryCode = useAppSelector(getCountry);
  // eslint-disable-next-line complexity
  const renderInput = useMemo(() => {
    switch (input.type) {
      case INPUT_TYPE.TEXT:
      case INPUT_TYPE.NUMBER:
      case INPUT_TYPE.EMAIL:
        return (
          <Input
            required={input.required}
            disabled={input.readOnly}
            key={input.code}
            type={input.type === INPUT_TYPE.NUMBER ? 'number' : 'text'}
            value={value as string}
            validations={
              input.type === INPUT_TYPE.EMAIL
                ? [
                    {
                      regex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      errorMessage: locale(Keys.INVALID_EMAIL),
                    },
                  ]
                : []
            }
          />
        );
      case INPUT_TYPE.PAN:
        return (
          <Pan
            readOnly={input.readOnly}
            key={input.code}
            onChange={onChange}
            value={value as string}
          />
        );
      case INPUT_TYPE.AADHAAR:
        return (
          <Aadhar
            readOnly={input.readOnly}
            key={input.code}
            onChange={onChange}
            value={value as string}
          />
        );
      case INPUT_TYPE.PHONE:
        return (
          <PhoneLegacy
            readOnly={input.readOnly}
            key={input.code}
            required={input.required}
            value={value as string}
            defaultCountryCode={defaultCountryCode as Country}
          />
        );
      case INPUT_TYPE.CHECKBOX:
        return (
          <CheckboxGroup value={value ? [...(value as string)] : []}>
            {/* @ts-ignore */}
            {input.options?.map((option: OptionType) => (
              <Checkbox
                label={option.label as string}
                value={option?.value || ''}
                disabled={option.disabled}
                key={option.value}
              />
            ))}
          </CheckboxGroup>
        );
      case INPUT_TYPE.RADIO:
        return (
          <RadioGroup
            name={input.name}
            type="tabs"
            classNames={styles['stepper-radio']}
            key={input.code}
            disabled={input.readOnly}
            value={value as string}
          >
            {input.options?.map((option) => (
              <Option
                label={option.label}
                value={option.value as string}
                key={option.label}
              />
            ))}
          </RadioGroup>
        );
      case INPUT_TYPE.MULTIMEDIA:
        return (
          <DocumentSection
            key={input.code}
            formats={input.multimedia_options?.mime_types}
            maxSize={input.multimedia_options?.max_size}
            fieldCode={input.code}
            documents={value}
            readOnly={input.readOnly}
          />
        );
      default:
        return <Text>{input.type} not available</Text>;
    }
  }, [
    defaultCountryCode,
    input.code,
    input.multimedia_options?.max_size,
    input.multimedia_options?.mime_types,
    input.name,
    input.options,
    input.readOnly,
    input.required,
    input.type,
    onChange,
    value,
  ]);

  const getDefaultValue = useCallback(
    (dropdownValue: DropdownValue | [DropdownValue]) => {
      if (Array.isArray(dropdownValue)) {
        return dropdownValue.map((val) => val?.value);
      }
      return [dropdownValue?.value];
    },
    [],
  );

  const handleOnChangeForDropdown = useCallback(
    (code, val, event, validity) => {
      if (input.isMulti && Array.isArray(val)) {
        const updatedValue = val?.map((arg) => ({
          value: arg?.value,
          label: arg?.label,
        }));
        // form onChange
        onChange(code, updatedValue, event, validity);
      } else {
        const updatedValue = { label: val?.label, value: val?.value };
        onChange(code, updatedValue, event, validity);
      }
    },
    [input.isMulti, onChange],
  );

  if (input.type === INPUT_TYPE.DROPDOWN) {
    return (
      <div key={input.code} className={styles['section-field']}>
        <div className={styles.dropdown}>
          <FormItem
            label={input.name}
            code={input.code}
            key={input.code}
            onChange={handleOnChangeForDropdown}
            required={input.required}
            legacy
          >
            <Select
              value={getDefaultValue(value as DropdownValue | [DropdownValue])}
              options={input.options}
              key={input.code}
              disabled={input.readOnly}
              multi={input.isMulti}
              search={input.isMulti}
            />
          </FormItem>
        </div>
      </div>
    );
  }
  if (input.type === INPUT_TYPE.DATE) {
    const dateObj = value ? getDateObject(`${value}`) : '';
    return (
      <div className={styles['section-field']}>
        <FormItem
          code={input.code}
          key={input.code}
          onChange={(code, val) => onChange(code, getFormattedDate(val))}
          required={input.required}
          label={input.name}
          legacy
        >
          <DatePicker
            onChange={() => {}}
            format="dd MMM, yyyy"
            placeholderText="DD / MM / YYYY"
            disabled={input.readOnly}
            value={value ? new Date(dateObj) : null}
          />
        </FormItem>
      </div>
    );
  }
  return (
    <div className={styles['section-field']}>
      <FormItem
        code={input.code}
        key={input.code}
        onChange={onChange}
        data-test-id={input.code}
        label={input.name}
        required={input.required}
        legacy
      >
        {renderInput}
      </FormItem>
    </div>
  );
}

export default SectionField;
