import React from 'react';
import Divider from 'src/@vymo/ui/atoms/divider';
import Text from 'src/@vymo/ui/atoms/text';
import { Card } from 'src/@vymo/ui/blocks';
import { ReactComponent as NotFoundIcon } from 'src/assets/icons/notFound.svg';
import styles from './index.module.scss';

function NotFoundPage() {
  return (
    <Card classNames={styles.workspace__customPage}>
      <div>
        <NotFoundIcon />
        <Text type="h3">Page Not Found</Text>
      </div>

      <Divider />
      <div>
        <Text>
          Sorry, the page you are looking for does not exist. Please check the
          URL or return to the homepage.
        </Text>
      </div>
    </Card>
  );
}

export default NotFoundPage;
