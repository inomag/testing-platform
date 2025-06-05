import _, { debounce } from 'lodash';
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Select from 'src/@vymo/ui/atoms/select';
import axios from 'src/workspace/axios';
import { getClientConfigData } from 'src/workspace/utils';
import { getFilteredOptions } from '../../configMappingFormItemsGenerator/contextManager/queries';
import { FormContextProps } from '../../formProvider/types';
import Link from '../link';
import { getReferralDropdownParams, getReferredModuleCode } from './queries';
import { ReferralDropdownProps } from './types';

function ReferralDropdown({
  code: fieldCode,
  value: stringfieldValue = '{}',
  disabled,
  onChange,
  online,
  source,
  // context_filters,
  customFilters,
  setReferralData,
  type,
  viewMode = false,
  ...props
}: ReferralDropdownProps & {
  setReferralData: FormContextProps['setReferralData'];
}) {
  const [referralOptions, setReferralOptions] = useState([]);
  const [apiCount, setApiCount] = useState(0);

  const referralRef = useRef() as MutableRefObject<any>;
  let value;
  let label;

  try {
    value = JSON.parse(stringfieldValue)?.code;
    label = JSON.parse(stringfieldValue)?.name;
  } catch (error) {
    label = stringfieldValue;
    throw new Error(
      'Invalid referral value. Value should be stringified object',
    );
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchReferrals = useCallback(
    debounce(async (params = {}) => {
      try {
        setApiCount((count) => count + 1);
        const { data: referralApiResponse } = await axios.get(
          `/${type === 'user_referral' ? 'users/v1' : 'leads'}/referrals`,
          {
            params,
          },
        );
        // TODO: harshit fix this
        // @ts-ignore
        const filteredOptions = getFilteredOptions(
          customFilters,
          referralApiResponse.results,
        );
        setReferralOptions(filteredOptions);
        setApiCount((count) => count - 1);
      } catch (error) {
        setApiCount((count) => count - 1);
      }
    }, 500),
    [customFilters],
  );

  const onSearchInputChange = useCallback(
    (searchText = '') => {
      if (searchText.length >= 3) {
        if ((referralRef.current?.getOptionsList?.()?.length ?? 0) === 0) {
          fetchReferrals(
            getReferralDropdownParams(customFilters ?? [], source, searchText),
          );
        }
      }
    },
    [customFilters, fetchReferrals, source],
  );

  useEffect(() => {
    if (online) {
      fetchReferrals(getReferralDropdownParams(customFilters ?? [], source));
    } else if (!online && _.isEmpty(customFilters)) {
      setReferralOptions([]);
    }
  }, [customFilters, fetchReferrals, online, source]);

  const onReferralDropdownChange = useCallback(
    (options, event) => {
      const { code, name, inputs_map: inputsMap } = options?.[0] ?? {};
      onChange(JSON.stringify({ code, name }), event, { data: { code } });
      setReferralData({ fieldCode, data: inputsMap });
    },
    [fieldCode, onChange, setReferralData],
  );

  return !viewMode ? (
    <Select
      ref={referralRef}
      value={value}
      disabled={disabled}
      options={referralOptions}
      onChange={onReferralDropdownChange}
      onSearchInputChange={onSearchInputChange}
      search
      optionsListLoading={Boolean(apiCount)}
      {...props}
    />
  ) : (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link
      title={label}
      url={`/${getReferredModuleCode(
        source,
        getClientConfigData()?.lead_modules,
      )}/leads/${fieldCode}/details`}
    />
  );
}

export default ReferralDropdown;
