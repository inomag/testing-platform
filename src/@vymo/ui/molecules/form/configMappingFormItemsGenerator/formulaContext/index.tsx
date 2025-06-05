/* eslint-disable no-console */
import _ from 'lodash';
import React, { ReactElement, useMemo } from 'react';
import { useFormContext } from '../../formProvider';
import { getFlattenConfig } from '../../formProvider/queries';
import { BaseContext } from './contextClass/baseContext';
import {
  nameSpaces as C,
  defaultEvaluateConfig,
} from './contextClass/constants';
import { ReferralContext } from './contextClass/referralContext';
import { evaluate } from './evaluate';
import { FormulaContextProps } from './types';

function FormulaContext({ children, formValue, context }: FormulaContextProps) {
  const { isDebug, referralData, config, setDebugMessage } =
    useFormContext(false);

  const formValueMap = useMemo(
    () => ({
      ...getFlattenConfig(config.data).reduce((acc, { code }) => {
        acc[code] = '';
        return acc;
      }, {}),
      ..._.mapValues(formValue, (field) =>
        // TODO: check if this is required , for arithmetic operator field should be of type number
        _.includes(['currency', 'number', 'date', 'time'], field.type) &&
        !_.isNaN(parseInt(field.value, 10))
          ? parseInt(field.value, 10)
          : field.value,
      ),
    }),
    [config.data, formValue],
  );

  const {
    data = { session: {}, vo: {} },
    store = { path: { session: '', vo: '' }, state: {} },
  } = context || {};
  const { path, state } = store;

  useMemo(() => {
    let sessionData = _.get(state, path.session, {});
    if (_.isEmpty(sessionData)) {
      sessionData = data.session;
    }
    const sessionContext = new BaseContext(sessionData);

    if (isDebug) {
      setDebugMessage({
        messageKey: 'Session Context',
        data: sessionContext,
      });
    }

    evaluate.setContext(C.NS_SESSION, sessionContext);
  }, [data.session, path.session, state, isDebug, setDebugMessage]);

  useMemo(() => {
    let voData = _.get(state, path.vo, {});
    if (_.isEmpty(voData)) {
      voData = data.vo;
    }
    const voContext = new BaseContext(voData);

    if (isDebug) {
      setDebugMessage({
        messageKey: 'VO Context',
        data: voContext,
      });
    }

    evaluate.setContext(C.NS_VO, voContext);
  }, [data.vo, path.vo, state, isDebug, setDebugMessage]);

  useMemo(() => {
    if (!_.isEmpty(referralData)) {
      const RefContext = new ReferralContext();
      Object.entries(referralData).forEach(([fieldCode, value]) => {
        if (fieldCode !== null && !_.isEmpty(value)) {
          const referralContext = new BaseContext(value);
          RefContext.setContext(fieldCode, referralContext);
        }
      });

      if (isDebug) {
        setDebugMessage({
          messageKey: 'Referral Context',
          data: RefContext,
        });
      }
      evaluate.setContext(C.NS_REFERRAL, RefContext);
    } else {
      evaluate.setContext(C.NS_REFERRAL, {});
    }
  }, [referralData, isDebug, setDebugMessage]);

  useMemo(() => {
    const formContext = new BaseContext(formValueMap);
    if (isDebug) {
      setDebugMessage({ messageKey: 'Form Context', data: formValueMap });
    }
    evaluate.setContext(C.NS_FORM, formContext);
  }, [formValueMap, isDebug, setDebugMessage]);

  useMemo(() => {
    _.each(defaultEvaluateConfig, (value, key) => {
      evaluate.setConfig(key, value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  return children as ReactElement<any, any>;
}

export default React.memo(FormulaContext);
