import React from 'react';
import { Checkbox } from 'src/@vymo/ui/atoms';
import ConsentLabel from './consentLabel';
import DocumentPreview from './documentPreview';
import ReadOnlyConsent from './readOnlyConsent';
import { Consent } from './types';
import styles from './index.module.scss';

interface IProps {
  consent: Consent;
  selectedValues: string[];
  onChange: (checked: boolean, value: string, event?: any) => void;
}
function ConsentItem({ consent, selectedValues, onChange }: IProps) {
  const { label, required, version, links } = consent;
  return (
    <div
      data-test-id="consentItem-wrapper"
      className={styles.consent__consentItem}
    >
      {consent.readOnlyText && (
        <div
          data-test-id="consentItem-readOnlyText"
          className={styles.consent__consentItem__read_only_text}
        >
          <ReadOnlyConsent readOnlyText={consent.readOnlyText} />
        </div>
      )}
      {consent.document && (
        <div className={styles.consent__consentItem__html}>
          <DocumentPreview />
        </div>
      )}
      <Checkbox
        label={
          <ConsentLabel
            key={label}
            label={label}
            required={required}
            links={links}
          />
        }
        disabled={consent.disabled}
        value={version}
        key={label}
        className={styles.consent__consentItem__field}
        data-test-id="consentItem-checkbox"
        onChange={onChange}
        // @ts-ignore
        selectedValues={selectedValues}
      />
    </div>
  );
}

export default ConsentItem;
