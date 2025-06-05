import React from 'react';
import { COPILOT } from 'src/modules/constants';
import ChildComponent from 'src/workspace/childComponent';

function getLayout() {
  return <ChildComponent id={COPILOT} />;
}

export default getLayout;
