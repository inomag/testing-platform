import React from 'react';
import Divider from 'src/@vymo/ui/atoms/divider';
import { HEADER, SESSION_EXPIRY } from 'src/modules/constants';
import ChildComponent from 'src/workspace/childComponent';

function getLayout() {
  return (
    <>
      <ChildComponent id={HEADER} />
      <ChildComponent id={SESSION_EXPIRY} />
      <Divider />
      <ChildComponent id="router" />
    </>
  );
}

export default getLayout;
