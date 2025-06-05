/* eslint-disable complexity */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text } from 'src/@vymo/ui/atoms';
import { Alert } from 'src/@vymo/ui/blocks';
import DocPreview from 'src/@vymo/ui/molecules/docPreview';
import classNames from 'classnames';
import { ReactComponent as UploadIcon } from 'src/assets/icons/upload.svg';
import { FileExtensions, MimeTypes } from './constants';
import CropImage from './cropImage';
import {
  generateMultimediaId,
  getCanAdd,
  getEnumKey,
  getFileType,
  getMimeTypeKeys,
  getSizeUnitFormat,
  getThumbnail,
  isImageMimeType,
  removeDocument,
} from './queries';
import { Document, DocumentState, DocumentUploaderProps } from './types';
import styles from './index.module.scss';

function DocumentUploader({
  acceptedMimeTypes = Object.values(MimeTypes),
  maxSize,
  onFileUpload,
  onFileRemove,
  title = '',
  multiple = false,
  fieldCode = 'file',
  documents = [],
  readOnly = false,
  maxFiles = null,
  editTool = false,
  link,
}: DocumentUploaderProps) {
  const [documentState, setDocumentState] = useState<DocumentState>([]);
  const uploadedDocuments = documentState;
  const [fileRemoved, setFileRemoved] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showEditTool, setShowEditTool] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<any>({});

  const uploadedDocumentsTemp = useRef<Document[]>([]);

  const canAdd = getCanAdd(multiple, maxFiles, uploadedDocuments.length);
  const acceptFileTypes = `${Array.from(acceptedMimeTypes).join(
    ',',
  )},${Array.from(Object.values(FileExtensions)).join(',')}`;

  useEffect(() => {
    if (fileRemoved && onFileRemove) {
      onFileRemove(fileRemoved, uploadedDocuments);
      setFileRemoved(null);
    }
  }, [fileRemoved, onFileRemove, uploadedDocuments]);

  useEffect(() => {
    if (documents?.length > 0) {
      setDocumentState(documents);
    }
  }, [documents]);

  const handleCropImageChange = useCallback(
    (imgArray: Document[] = []) => {
      setShowEditTool(false);

      const docsWithoutImages = uploadedDocumentsTemp.current.filter(
        (doc) => !isImageMimeType(doc.mime),
      );

      uploadedDocumentsTemp.current = [...imgArray, ...docsWithoutImages];

      setDocumentState([
        ...uploadedDocuments,
        ...uploadedDocumentsTemp.current,
      ]);

      onFileUpload([...uploadedDocuments, ...uploadedDocumentsTemp.current]);
    },
    [onFileUpload, uploadedDocuments],
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUploadError(null);
      if (event.target.files) {
        const files = Array.from(event.target.files);
        let errorOccurred = false;
        let isImageEditTool = false;
        uploadedDocumentsTemp.current = [];
        if (maxFiles && files.length > maxFiles) {
          setUploadError(`You can upload maximum ${maxFiles} files.`);
          errorOccurred = true;
          return;
        }
        files.forEach((file) => {
          const fileType = getFileType(file);
          const mineEnumValue = getEnumKey(fileType);

          if (!acceptedMimeTypes.includes(mineEnumValue)) {
            setUploadError(
              `The file type ${getMimeTypeKeys([mineEnumValue]).join(
                ', ',
              )} is not supported.`,
            );
            errorOccurred = true;
            return;
          }
          if (Number(maxSize) > 0 && file.size > maxSize) {
            setUploadError(
              `The file is too large. Max size is ${getSizeUnitFormat(
                maxSize,
              )}.`,
            );
            errorOccurred = true;
            return;
          }

          const doc: Document = {
            id: generateMultimediaId(),
            mime: mineEnumValue,
            file,
            size: file.size,
            uri: URL.createObjectURL(file),
            isNew: true,
          };

          if (isImageMimeType(mineEnumValue)) {
            // @ts-ignore
            isImageEditTool = true;
          }
          uploadedDocumentsTemp.current.push(doc);
        });

        if (!errorOccurred) {
          if (isImageEditTool) {
            setShowEditTool(true);
          } else {
            handleCropImageChange();
          }
        }

        event.target.value = '';
      }
    },
    [maxFiles, acceptedMimeTypes, maxSize, handleCropImageChange],
  );

  const handleRemoveFile = useCallback(
    (fileName: string, idToRemove: number | string, event) => {
      event?.stopPropagation();
      setFileRemoved(fileName);

      setDocumentState((prevDocsState) =>
        removeDocument(prevDocsState, idToRemove),
      );
    },
    [],
  );

  const handlePreview = useCallback(
    (event: React.MouseEvent, { file }: Document) => {
      event.preventDefault();
      const previewUrl = URL.createObjectURL(file);
      setSelectedDocument({
        uri: previewUrl,
        fileName: file?.name,
        file,
      });
      setShowPreview(true);
    },
    [],
  );

  return (
    <>
      {editTool && showEditTool && (
        <CropImage
          imageData={uploadedDocumentsTemp.current.filter((doc) =>
            isImageMimeType(doc.mime),
          )}
          onChange={handleCropImageChange}
        />
      )}

      <div className={styles.uploader}>
        <div className={styles.uploader__header}>
          <div className={styles.uploader__header__sub}>
            {title && (
              <div className={styles.uploader__header__sub__title}>{title}</div>
            )}
            {!(readOnly || !canAdd) && (
              <Text type="sublabel">{`You can upload ${getMimeTypeKeys(
                acceptedMimeTypes,
              ).join(', ')} file formats`}</Text>
            )}
            {Number(maxSize) > 0 && !(readOnly || !canAdd) && (
              <Text type="sublabel">{`Max size: ${getSizeUnitFormat(
                maxSize,
              )}`}</Text>
            )}
            {link && <Text link={link.url}>{link.label}</Text>}
          </div>

          {!(readOnly || !canAdd) && multiple && Boolean(maxFiles) && (
            <div
              className={styles.uploader__header__text}
            >{`Max File to Upload remaining ${
              maxFiles ? maxFiles - uploadedDocuments.length : ''
            }`}</div>
          )}
        </div>

        {uploadedDocuments.length > 0 ? (
          <div className={styles.uploaded__files__list}>
            {!(readOnly || !canAdd) && (
              <label
                data-test-id="document-uploader-test-label"
                htmlFor={`input-field-${fieldCode}`}
                className={styles.uploader__button}
              >
                <span className={styles.plus}>+</span>
                <input
                  data-test-id="document-uploader-test"
                  id={`input-field-${fieldCode}`}
                  name={`input-field-${fieldCode}`}
                  type="file"
                  accept={acceptFileTypes}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  hidden
                  multiple={multiple}
                  disabled={readOnly || !canAdd}
                />
              </label>
            )}
            {uploadedDocuments.map((document, index) => (
              <div className={classNames(styles.uploader__thumbnail)}>
                <div
                  data-test-id={`document-uploader-thumbnail-${index}`}
                  key={`${
                    uploadedDocuments[index].file?.name
                  }-${Math.random()}`}
                  className={classNames(styles.uploader__thumbnail__item)}
                  onClick={(event) => handlePreview(event, document)}
                  aria-hidden="true"
                >
                  {getThumbnail(
                    document.file,
                    document?.uri,
                    document?.thumbnail,
                  )}
                </div>

                {!readOnly && (
                  <div
                    data-test-id={`document-uploader-remove-${index}`}
                    className={styles['uploader__thumbnail--remove']}
                    onClick={(event) =>
                      handleRemoveFile(
                        uploadedDocuments[index]?.file?.name,
                        uploadedDocuments[index]?.id,
                        event,
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleRemoveFile(
                          uploadedDocuments[index]?.file?.name,
                          uploadedDocuments[index]?.id,
                          event,
                        );
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    X
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          !(readOnly || !canAdd) && (
            <label
              data-test-id="document-uploader-test-label"
              htmlFor={`input-field-${fieldCode}`}
              className={styles.withoutFiles__uploader__button}
            >
              <UploadIcon />
              <Text> Upload</Text>

              <input
                data-test-id="document-uploader-test"
                id={`input-field-${fieldCode}`}
                name={`input-field-${fieldCode}`}
                type="file"
                accept={acceptFileTypes}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                hidden
                multiple={multiple}
                disabled={readOnly || !canAdd}
              />
            </label>
          )
        )}

        {uploadError && (
          <Alert
            data-test-id="file-upload-error"
            variant="error"
            duration={10000}
            closeable
            classNames={styles.uploader__alert}
          >
            {uploadError}
          </Alert>
        )}

        <DocPreview
          document={selectedDocument}
          open={showPreview}
          onClose={() => setShowPreview(false)}
        />
      </div>
    </>
  );
}

export default React.memo(DocumentUploader);
