import React from 'react';
import Divider from 'src/@vymo/ui/atoms/divider';
import ChildComponent from 'src/workspace/childComponent';

function getLayout() {
  return (
    <>
      <Divider />
      <ChildComponent id="router" />
    </>
  );
}

export default getLayout;
