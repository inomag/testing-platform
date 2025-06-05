import { noop } from 'lodash';
import React, { useCallback } from 'react';
import DocumentUploader from 'src/@vymo/ui/molecules/documentUploader';
import { getSizeUnitFormat } from 'src/@vymo/ui/molecules/documentUploader/queries';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import styles from '../index.module.scss';

function DocumentSection({
  formats,
  maxSize,
  fieldCode,
  onChange = noop,
  documents,
  readOnly = false,
}) {
  const handleOnFileChange = useCallback(
    (uploadedFiles) => {
      onChange(uploadedFiles);
    },
    [onChange],
  );

  const handleFileRemove = useCallback(
    (_, updatedFiles) => {
      handleOnFileChange(updatedFiles);
    },
    [handleOnFileChange],
  );

  return (
    <div className={styles['document-section']} data-test-id="document-section">
      {formats && (
        <li>
          {locale(Keys.SUPPORTED_FORMATS_INFO, {
            formats: formats ? formats.join(', ') : 'all',
          })}
        </li>
      )}
      {Number(maxSize) > 0 && (
        <li>
          {locale(Keys.MAX_SIZE_LIMIT_INFO, {
            size: getSizeUnitFormat(maxSize),
          })}
        </li>
      )}
      <div>
        <DocumentUploader
          acceptedMimeTypes={formats}
          maxSize={maxSize}
          onFileUpload={handleOnFileChange}
          onFileRemove={handleFileRemove}
          title={locale(Keys.UPLOAD_FILE)}
          multiple
          fieldCode={fieldCode}
          documents={documents}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}

export default DocumentSection;
