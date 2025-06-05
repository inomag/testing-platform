import React from 'react';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';

// TODO: will implement when figma is finalized
function DocumentPreview() {
  return <div>{locale(Keys.DOCUMENT_PREVIEW)}</div>;
}

export default DocumentPreview;
