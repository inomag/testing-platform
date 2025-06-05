import React from 'react';
import { HEADER } from 'src/modules/constants';
import ChildComponent from 'src/workspace/childComponent';

function getLayout() {
  return (
    <>
      <ChildComponent id={HEADER} />
      <ChildComponent id="router" />
    </>
  );
}

export default getLayout;
