import React from 'react';
import { Text } from 'src/@vymo/ui/atoms';
import classnames from 'classnames';
import { ReactComponent as Empty } from 'src/assets/icons/empty.svg';
import styles from './index.module.scss';

export default function NoData({
  classNames,
  message = 'No Data',
}: {
  classNames?: string;
  message?: string;
}) {
  return (
    <div
      className={classnames(classNames, styles.noData)}
      data-test-id="no-data"
    >
      <Empty />
      <Text type="h5" data-test-id="noDataMessage">
        {message}
      </Text>
    </div>
  );
}
