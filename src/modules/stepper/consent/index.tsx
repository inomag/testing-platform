import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'src/store/hooks';
import { getApiStatus, getCTAs } from '../selectors';
import { setCtaDataByActionCode, setTemplateUi } from '../slice';
import { useStepperContext } from '../stepperProvider';
import { saveAction } from '../thunk';
import ConsentItem from './consentItem';
import { ConsentProps, Consent as ConsentType } from './types';
import styles from './index.module.scss';

function Consent({ consents = [] }: ConsentProps) {
  const [consentItems, setConsentItems] = useState<ConsentType[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const dispatch = useDispatch();
  const { isDialog, debugMode } = useStepperContext();
  const apiStatus = useAppSelector((state) => getApiStatus(state, isDialog));
  const allCtas = useAppSelector((state) => getCTAs(state, isDialog));

  useEffect(() => {
    if (apiStatus === 'cta_clicked') {
      dispatch(
        // @ts-ignore
        saveAction({
          payload: {
            consents: consentItems,
          },
          isDialog,
          debugMode,
        }),
      );
    }
  }, [apiStatus, consentItems, debugMode, dispatch, isDialog]);

  useEffect(() => {
    dispatch(
      setTemplateUi({ isDialog, templateUi: { content: { grow: true } } }),
    );

    setConsentItems(consents);
    const selectedVersions = consents
      .filter((consent) => consent.selected)
      .map(({ version: versionKey }) => versionKey);
    setSelectedValues(selectedVersions);

    const disableCtas = consents.some(
      (consent) => consent.required && !consent.selected,
    );

    allCtas.map((cta) =>
      dispatch(
        setCtaDataByActionCode({
          code: cta.action,
          cta: { ...cta, enabled: !disableCtas },
          isDialog,
        }),
      ),
    );
    return () => {
      dispatch(
        setTemplateUi({ isDialog, templateUi: { content: { grow: false } } }),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConsentFieldsChange = useCallback(
    (selected: boolean, version: string) => {
      const index = consentItems.findIndex(
        (consent) => consent.version === version,
      );
      const updatedConsentItems = [...consentItems];
      updatedConsentItems[index] = { ...updatedConsentItems[index], selected };
      setConsentItems(updatedConsentItems);
      if (selected) {
        setSelectedValues([...new Set([...selectedValues, version])]);
      } else {
        setSelectedValues(selectedValues.filter((value) => value !== version));
      }
      const disableCtas = updatedConsentItems.some(
        (consent) => consent.required && !consent.selected,
      );
      allCtas.map((cta) =>
        dispatch(
          setCtaDataByActionCode({
            code: cta.action,
            cta: { ...cta, enabled: !disableCtas },
            isDialog,
          }),
        ),
      );
    },
    [consentItems, allCtas, dispatch, isDialog, selectedValues],
  );
  return (
    <div className={styles.consent}>
      {consentItems.map((consent) => (
        <ConsentItem
          consent={consent}
          selectedValues={selectedValues}
          onChange={handleConsentFieldsChange}
        />
      ))}
    </div>
  );
}

export default Consent;
