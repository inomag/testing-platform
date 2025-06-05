import React from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import Text from 'src/@vymo/ui/atoms/text';
import { ReactComponent as CheckIcon } from 'src/assets/icons/checkCircle.svg';
import { ReactComponent as DownloadIcon } from 'src/assets/icons/download.svg';
import { SectionMeta } from 'src/models/stepperFormLegacy/types';
import styles from '../index.module.scss';

interface IProps {
  meta?: SectionMeta;
}
// eslint-disable-next-line complexity
function InfoSection({ meta, children }: React.PropsWithChildren<IProps>) {
  const { downloads, info, title, description, status, service, links } =
    meta || {};

  const descriptionText =
    service && meta?.inputObj?.value ? 'Signed' : description;

  return (
    <div className={styles['stepper-sections__info-section']}>
      {status === 'completed' && <CheckIcon />}
      {title && <Text bold>{title ?? ''}</Text>}
      {descriptionText && <Text bold>{descriptionText}</Text>}
      {Array.isArray(info) &&
        info.map((infoItem) => (
          <div>
            <Text>{infoItem.label}</Text> - <Text bold>{infoItem.value}</Text>
          </div>
        ))}
      {downloads?.map((item) => (
        <a href={item.link} download>
          <Button className={styles['section-button']}>
            <>
              {item.label}&nbsp;
              <DownloadIcon />
            </>
          </Button>
        </a>
      ))}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        {links?.map((linkObj) => (
          <Button
            type="outlined"
            linkProps={{ href: linkObj.link, target: '_blank' }}
            key={linkObj.label}
            className={styles['stepper-sections__info-section__link']}
          >
            {linkObj.label}
          </Button>
        ))}
      </div>
      {children}
    </div>
  );
}

export default InfoSection;
