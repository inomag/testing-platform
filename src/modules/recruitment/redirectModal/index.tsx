import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'src/@vymo/ui/atoms/button';
import Text from 'src/@vymo/ui/atoms/text';
import styles from './index.module.scss';

function RedirectModal({ link }) {
  const navigate = useNavigate();
  const handleContinue = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div className={styles['redirect-modal']}>
      <div className={styles['modal-content']}>
        <div className={styles['modal-text']}>
          <Text type="h3">Continue with Vymo!</Text>
          <Text>
            It seems that you’re already a licensed user with Vymo. Please use
            the Vymo app to proceed with you application.
          </Text>
        </div>
        <Button onClick={handleContinue}>Continue on Vymo</Button>
      </div>
    </div>
  );
}

export default RedirectModal;
