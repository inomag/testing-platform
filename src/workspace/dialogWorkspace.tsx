import _ from 'lodash';
import React, { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAppSelector } from 'src/store/hooks';
import ChildComponent from './childComponent';
import { getWorkspaceDialogs } from './selectors';
import { getAppRootElement } from './utils';

function DialogWorkspace() {
  const dialogList = useAppSelector(getWorkspaceDialogs);
  const dialogRef = useRef<any>(null);

  useEffect(() => {
    const root = getAppRootElement();
    const dialogDiv = root.querySelector('#dialog-div');
    if (root && !dialogDiv) {
      dialogRef.current = document.createElement('div');
      dialogRef.current.style.cssText = `
        position: fixed;
        top: 5px;
        width: 100%;
        z-index: 1000;
        background-color: white;
      `;
      dialogRef.current.id = 'dialog-div';
      root.appendChild(dialogRef.current);
    }
    if (!dialogRef.current) {
      dialogRef.current = dialogDiv;
    }
  }, []);

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0];
    if (Object.values(dialogList).length > 0) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'auto';
    }
  }, [dialogList]);

  const portals = useMemo(
    () =>
      Object.values(dialogList).map(({ props: childProps, code }) => (
        <ChildComponent id={code} props={childProps} isDialog />
      )),
    [dialogList],
  );

  if (!dialogRef.current || _.isEmpty(dialogList)) {
    return null;
  }

  return createPortal(portals, dialogRef.current);
}

export default DialogWorkspace;
