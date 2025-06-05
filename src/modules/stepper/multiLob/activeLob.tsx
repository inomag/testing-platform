import React from 'react';
import { Tag, Text } from 'src/@vymo/ui/atoms';
import { Card } from 'src/@vymo/ui/blocks';
import { ActiveLobProps } from './types';
import styles from './index.module.scss';

function ActiveLob({ title, attributes = [], tag }: ActiveLobProps) {
  return (
    <Card classNames={styles.lob}>
      <Text bold>{title}</Text>
      <Tag variant="info">{tag}</Tag>
      {attributes.map(({ name, value }) => (
        <div className={styles.lob__fieldLabel}>
          <Text type="sublabel">{name}</Text>
          <Text bold type="subText">
            {value}
          </Text>
        </div>
      ))}
    </Card>
  );
}

export default ActiveLob;
