import React, { useState } from 'react';
import { Text } from 'src/@vymo/ui/atoms';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import ChildComponent from 'src/workspace/childComponent';
import styles from './index.module.scss';

export function MockStepper() {
  const [debugMode] = useState('playground');
  return (
    <div className={styles.mockStepper}>
      <Text type="h4">{locale(Keys.STEPPER_PLAYGROUND_CAPITAL)}</Text>
      <div className={styles.mockStepper__module}>
        <ChildComponent
          id="PROGRESSIVE_STEPPER"
          props={{
            debugMode,
          }}
          key={debugMode}
        />
      </div>
    </div>
  );
}
