import _, { isEmpty } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from 'src/@vymo/ui/atoms';
import Loader from 'src/@vymo/ui/atoms/loader';
import Modal, { Body } from 'src/@vymo/ui/blocks/modal';
import { MimeTypes } from 'src/@vymo/ui/molecules/documentUploader/constants';
import { getFileType } from 'src/@vymo/ui/molecules/documentUploader/queries';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { getIsFilePreviewSupported } from './queries';
import styles from './index.module.scss';

function LoadingRenderer() {
  return <Loader visible />;
}

function DocPreview({
  document,
  modal = true,
  open = false,
  onClose = _.noop,
}) {
  const [textContent, setTextContent] = useState('');
  const [fileReadError, setFileReadError] = useState('');

  const fileType = getFileType(document?.file);

  useEffect(() => {
    if (
      document?.file &&
      [MimeTypes.TEXT, MimeTypes.JSON, MimeTypes.MD].includes(fileType)
    ) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setTextContent(e.target.result);
      };
      reader.onerror = () => {
        setFileReadError('Failed to load file content');
      };
      reader.readAsText(document?.file);
    }
  }, [document?.file, fileType]);

  const downloadFile = () => {
    const previewUrl = URL.createObjectURL(document?.file);
    onClose();
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  const isFilePreviewSupported = useMemo(
    () => getIsFilePreviewSupported(document?.file),
    [document?.file],
  );

  // eslint-disable-next-line complexity
  const getDocPreviewRender = () => {
    let json = '';
    const fileSizeInMB = (document?.file?.size ?? 0) / (1024 * 1024);
    const isLargeCSV = fileType === MimeTypes.CSV && fileSizeInMB > 1;
    const isLargePDF = fileType === MimeTypes.PDF && fileSizeInMB > 2;

    if (isLargeCSV || isLargePDF) {
      return (
        <div className={styles.previewModal__fallback}>
          <Button type="outlined" onClick={downloadFile}>
            Download {fileType === MimeTypes.PDF ? 'PDF' : 'CSV'}
          </Button>
          <div className={styles.previewModal__fallback__message}>
            <div>
              This {fileType === MimeTypes.PDF ? 'PDF' : 'CSV'} file is{' '}
              {fileSizeInMB.toFixed(2)} MB and may cause the browser to slow
              down.
            </div>
            <div>We recommend downloading the file.</div>
          </div>
        </div>
      );
    }

    switch (fileType) {
      case MimeTypes.DOC:
      case MimeTypes.DOCX:
      case MimeTypes.PPT:
      case MimeTypes.PPTX:
      case MimeTypes.XLS:
      case MimeTypes.XLSX:
        return (
          <Button type="outlined" onClick={downloadFile}>
            Download File
          </Button>
        );

      case MimeTypes.SVG:
        // eslint-disable-next-line no-case-declarations
        const previewUrl = URL.createObjectURL(document?.file);
        return <img src={previewUrl} alt="" />;

      case MimeTypes.TEXT:
        return <pre>{fileReadError || textContent}</pre>;

      case MimeTypes.JSON:
        try {
          json = JSON.stringify(JSON.parse(textContent), null, 2);
        } catch (e) {
          json = 'Invalid JSON format';
        }
        return <pre>{fileReadError || json}</pre>;

      case MimeTypes.MD:
        return (
          <div>
            {fileReadError ? (
              <pre>{fileReadError}</pre>
            ) : (
              <div>
                <ReactMarkdown>{textContent}</ReactMarkdown>
              </div>
            )}
          </div>
        );

      default:
        return (
          <DocViewer
            documents={[document]}
            pluginRenderers={DocViewerRenderers}
            className={styles.previewModal__docViewer}
            config={{
              header: {
                disableFileName: true,
              },
              pdfVerticalScrollByDefault: true,
              loadingRenderer: {
                overrideComponent: LoadingRenderer,
                showLoadingTimeout: 0,
              },
            }}
            theme={{
              textPrimary: 'var(--text-default)',
              textSecondary: 'var(--text-subtle)',
            }}
          />
        );
    }
  };

  if (!isEmpty(document)) {
    if (modal && open) {
      if (isFilePreviewSupported) {
        return (
          <Modal
            showCloseButton
            open
            onClose={onClose}
            closeOnEscape
            classNames={styles.previewModal}
            data-test-id="document-preview-modal"
          >
            <Body>
              <div className={styles.previewModal__body}>
                {getDocPreviewRender()}
              </div>
            </Body>
          </Modal>
        );
      }
      downloadFile();
      return null;
    }
    if (!modal) {
      return getDocPreviewRender();
    }
  }
}

export default DocPreview;
