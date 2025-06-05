import React, { useMemo } from 'react';
import ExternallLogin from './externalLogin';
import InternalLogin from './internalLogin';
import styles from './index.module.scss';

function LoginType({
  type = 'INTERNAL',
}: {
  type: 'INTERNAL' | 'EXTERNAL' | 'ALL';
}) {
  const loginComponent = useMemo(() => {
    switch (type) {
      case 'INTERNAL':
        return <InternalLogin />;

      case 'EXTERNAL':
        return <ExternallLogin />;

      case 'ALL':
        return (
          <div>
            <ExternallLogin />
            <InternalLogin />
          </div>
        );

      default:
        return null; // Handle unexpected type
    }
  }, [type]);

  return <div className={styles.loginType}>{loginComponent}</div>;
}

export default LoginType;
