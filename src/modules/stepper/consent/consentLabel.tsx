import React from 'react';
import Text from 'src/@vymo/ui/atoms/text';
import classnames from 'classnames';
import { processConsentLabel } from '../queries';
import styles from './index.module.scss';

interface IProps {
  label: string;
  required: boolean;
  links: { [key: string]: any } | null;
}

function ConsentLabel({ label, required, links }: IProps) {
  const labelAttributes = processConsentLabel(links, label);
  return (
    <>
      {labelAttributes?.map(({ text, bold, link }, index) => (
        <Text
          data-test-id={`label-attribute-text-${index}`}
          key={text}
          bold={bold}
          link={link}
        >
          {text}
        </Text>
      ))}
      <span
        className={classnames({
          [styles.consent__consentItem__required]: required,
        })}
      />
    </>
  );
}

export default React.memo(ConsentLabel);
