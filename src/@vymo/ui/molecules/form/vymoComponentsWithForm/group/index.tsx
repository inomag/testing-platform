import React, { ReactNode } from 'react';
import { Collapsible } from 'src/@vymo/ui/blocks';
import { ReactComponent as RemoveIcon } from 'src/assets/icons/cross.svg';
import styles from '../aif/index.module.scss';

function Group({ groupTitle, code, children, deleteFieldsAtCode }) {
  const deleteHandler = () => {
    deleteFieldsAtCode({ code });
  };

  const collapsibleTitle: ReactNode = (
    <div className={styles.groupCollapsible} data-test-id="group-collapsible">
      <h3
        className={styles.groupCollapsible__title}
        data-test-id="group-collapsible-title"
      >
        {groupTitle}
      </h3>
      <RemoveIcon
        className={styles.groupCollapsible__icon}
        onClick={deleteHandler}
        data-test-id={`${code}-remove`}
      />
    </div>
  );

  return (
    <Collapsible title={collapsibleTitle} open={false}>
      {children}
    </Collapsible>
  );
}

export default Group;
