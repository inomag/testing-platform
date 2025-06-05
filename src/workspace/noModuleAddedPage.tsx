import React from 'react';
import Divider from 'src/@vymo/ui/atoms/divider';
import Text from 'src/@vymo/ui/atoms/text';
import { Card } from 'src/@vymo/ui/blocks';
import { ReactComponent as UnknownDocumentIcon } from 'src/assets/icons/unkownDocument.svg';
import styles from './index.module.scss';

function NoModuleAddedPage() {
  return (
    <Card classNames={styles.workspace__customPage}>
      <div>
        <UnknownDocumentIcon />
        <Text type="h3">Welcome To Web Platform</Text>
      </div>

      <Divider />
      <div>
        <Text>
          No Module added for this app. Add the module in
          modulesReducerConfig.ts file to start using.
        </Text>
      </div>
    </Card>
  );
}

export default NoModuleAddedPage;
