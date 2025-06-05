import { isEmpty } from 'lodash';
import React, { useCallback } from 'react';
import SkeletonLoader from 'src/@vymo/ui/blocks/skelton';
import DocumentUploader from 'src/@vymo/ui/molecules/documentUploader';
import { getDocObject } from './queries';
import { FormDocumentUploaderProps } from './types';
import useDocumentValue from './useDocumentValue';
import styles from './index.module.scss';

function DocumentAdapter({
  code,
  value,
  disabled,
  onChange,
  multimediaOptions = { media_type: 'document' },
}: FormDocumentUploaderProps) {
  const { media_type: mediaType } = multimediaOptions;

  const { value: parsedDocuments, filesLength } = useDocumentValue({
    value,
    code,
  });

  const handleFileChange = useCallback(
    (uploadedDocuments) => {
      const documents = getDocObject(uploadedDocuments, mediaType);
      onChange(documents);
    },
    [mediaType, onChange],
  );

  const handleFileRemove = useCallback(
    (fileRemoved, uploadedDocuments) => {
      const documents = getDocObject(uploadedDocuments, mediaType);
      onChange(documents);
    },
    [mediaType, onChange],
  );

  if (!isEmpty(value) && isEmpty(parsedDocuments)) {
    return (
      <div className={styles.document_skelton}>
        {Array.from({ length: filesLength }, (_, index) => index).map(() => (
          <SkeletonLoader
            rounded={false}
            isMargin={false}
            rect
            height={62}
            width={62}
          />
        ))}
      </div>
    );
  }

  return (
    <DocumentUploader
      acceptedMimeTypes={multimediaOptions.mime_types}
      maxSize={multimediaOptions.max_size}
      onFileUpload={handleFileChange}
      onFileRemove={handleFileRemove}
      multiple
      fieldCode={code}
      documents={parsedDocuments}
      readOnly={disabled}
      maxFiles={multimediaOptions.max_files}
      editTool
    />
  );
}

export default React.memo(DocumentAdapter);
