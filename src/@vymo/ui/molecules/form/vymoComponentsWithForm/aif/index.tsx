/* eslint-disable no-console */
import _ from 'lodash';
import React, { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Button } from 'src/@vymo/ui/atoms';
import Text from 'src/@vymo/ui/atoms/text';
import { Collapsible } from 'src/@vymo/ui/blocks';
import { useFormContext } from 'src/@vymo/ui/molecules/form/formProvider';
import { getObjDifferenceByKeys } from 'src/workspace/utils';
import { AppendFieldsAtCodeProps } from '../../formProvider/types';
import { getConfigToAppend } from './queries';
import { AifProps } from './types';
import styles from './index.module.scss';

function Aif({
  inputFields = [],
  groupTitle = '',
  // @ts-ignore
  value = [],
  additionalData,
  addActionTitle = '',
  // minGroup = 1,
  disabled,
  maxGroup = 1,
  code = '',
  children = null,
  appendFieldsAtCode,
  // @ts-ignore
  getFieldsPayloadData,
  onChange,
  isDebug,
  viewMode = false,
}: AifProps & {
  additionalData: Array<any>;
  appendFieldsAtCode: ReturnType<typeof useFormContext>['appendFieldsAtCode'];
  isDebug: ReturnType<typeof useFormContext>['isDebug'];
}) {
  const { setDebugMessage } = useFormContext(false);
  const handleAddGroup = useCallback(() => {
    const fieldToAppend: AppendFieldsAtCodeProps = {
      code,
      // @ts-ignore
      config: getConfigToAppend(inputFields, groupTitle, code),
      actionType: 'updateAtCode',
      childrenDisplayType: 'nested',
    };
    if (isDebug) {
      setDebugMessage({
        messageKey: `Added AIF field for ${groupTitle}`,
        data: fieldToAppend,
      });
    }
    if (value < maxGroup) {
      appendFieldsAtCode(fieldToAppend);
    }
  }, [
    value,
    maxGroup,
    inputFields,
    code,
    groupTitle,
    appendFieldsAtCode,
    isDebug,
    setDebugMessage,
  ]);

  const aifElementsValueStringified = useMemo(
    () =>
      JSON.stringify(
        Array.isArray(children)
          ? children.map((childData) =>
              // @ts-ignores
              getFieldsPayloadData(childData?.props?.field?.children ?? []),
            )
          : [],
      ),
    [children, getFieldsPayloadData],
  );

  useEffect(() => {
    if (aifElementsValueStringified) {
      const modifiedAdditionalData = {
        meta: { groupTitle, elements: aifElementsValueStringified },
      };

      onChange(
        JSON.parse(modifiedAdditionalData.meta.elements).length,
        null,
        modifiedAdditionalData,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aifElementsValueStringified, groupTitle]);

  // this useEffect should run when the additionalData elements change through props from outside
  // and not equal to current aifElementsValue data
  // configAppend would be overriden form additional data
  useEffect(() => {
    // @ts-ignore
    const groups = JSON.parse(_.get(additionalData, 'meta.elements', '[]'));

    if (!_.isEqual(groups, JSON.parse(aifElementsValueStringified))) {
      const configAppend = groups.map((groupInputs) =>
        getConfigToAppend(groupInputs, groupTitle, code),
      );

      appendFieldsAtCode({
        code,
        config: configAppend,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [additionalData]);

  const canAdd = value < maxGroup;

  if (viewMode) {
    return (
      <Text bold>sorry, View Mode is not supported for AIF type field</Text>
    );
  }

  const collapsibleTitle: ReactNode = (
    <div className={styles.groupCollapsible} data-test-id="group-collapsible">
      <h3 className={styles.groupCollapsible__title}>{groupTitle}</h3>
      <p className={styles.groupCollapsible__text}>{`Max grouping remaining: ${
        maxGroup - value
      }`}</p>
    </div>
  );
  return (
    <Collapsible key={code} title={collapsibleTitle} open={false} className="">
      <>
        {children}
        {canAdd && (
          <div className={styles.aifWrapper}>
            <Button
              className={styles.aifWrapper__addButton}
              disabled={disabled}
              onClick={handleAddGroup}
              data-test-id={`${code}-aif-button`}
            >
              {addActionTitle}
            </Button>
          </div>
        )}
      </>
    </Collapsible>
  );
}

export default React.memo(Aif, (prevProps, nextProps) => {
  const objDiff = getObjDifferenceByKeys(prevProps, nextProps);
  return _.isEmpty(objDiff);
});
