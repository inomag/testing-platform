import React from 'react';
import ChildComponent from 'src/workspace/childComponent';

function getLayout() {
  return (
    <>
      <ChildComponent id="HEADER" />
      <ChildComponent id="router" />
    </>
  );
}

export default getLayout;
