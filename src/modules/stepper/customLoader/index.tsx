import React from 'react';
import { Loader } from 'src/@vymo/ui/atoms';
import styles from './index.module.scss';

function CustomLoader(data) {
  return (
    <div
      data-test-id="custom-loader-container"
      className={styles.customLoader__container}
    >
      <Loader
        color="var(--text-default)"
        className={styles.customLoader__loader}
      />
      <div className={styles.customLoader__body}>
        <div
          data-test-id="custom-loader-status-text"
          className={styles.customLoader__body__statusText}
        >
          {data?.statusText}
        </div>
        <div
          data-test-id="custom-loader-description"
          className={styles.customLoader__body__description}
        >
          {data?.description}
        </div>
      </div>
    </div>
  );
}

export default CustomLoader;
