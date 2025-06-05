/* eslint-disable complexity */
import React from 'react';
import classNames from 'classnames';
import { ReactComponent as ExcelFile } from 'src/assets/icons/excel.svg';
import { ReactComponent as HtmlFile } from 'src/assets/icons/html.svg';
import { ReactComponent as ImageFile } from 'src/assets/icons/image.svg';
import { ReactComponent as JsonFile } from 'src/assets/icons/json.svg';
import { ReactComponent as MarkdownFile } from 'src/assets/icons/markdown.svg';
import { ReactComponent as PdfFile } from 'src/assets/icons/pdf.svg';
import { ReactComponent as PptFile } from 'src/assets/icons/ppt.svg';
import { ReactComponent as TextDocument } from 'src/assets/icons/text.svg';
import { ReactComponent as UnknownDocument } from 'src/assets/icons/unkownDocument.svg';
import { ReactComponent as VideoFile } from 'src/assets/icons/video.svg';
import { ReactComponent as WordFile } from 'src/assets/icons/word.svg';
import { MimeTypes } from './constants';
import styles from './index.module.scss';

export const getFileType = (file) => {
  let fileType = file?.type;

  if (!fileType) {
    const fileExtension = file?.name?.split('.').pop()?.toLowerCase();

    if (fileExtension === 'md') {
      fileType = MimeTypes.MD;
    }
  }

  return fileType;
};

export const getThumbnail = (file: File, uri?: string, thumbnail?: string) => {
  if (thumbnail) {
    return (
      <img
        src={thumbnail}
        data-test-id="file-thumbnail"
        alt="Uploaded file"
        className={styles.uploader__thumbnail__image}
      />
    );
  }

  const thumbnailWhenSvg = classNames(
    styles.uploader__thumbnail__image,
    styles.uploader__thumbnail__whenSvg,
  );

  const fileType = getFileType(file);

  switch (fileType) {
    case MimeTypes.DOC:
    case MimeTypes.DOCX:
      return <WordFile className={thumbnailWhenSvg} data-test-id="doc" />;
    case MimeTypes.PDF:
      return <PdfFile className={thumbnailWhenSvg} data-test-id="pdf" />;
    case MimeTypes.PPT:
    case MimeTypes.PPTX:
      return <PptFile className={thumbnailWhenSvg} data-test-id="ppt" />;
    case MimeTypes.XLS:
    case MimeTypes.XLSX:
      return <ExcelFile className={thumbnailWhenSvg} data-test-id="xlsx" />;
    case MimeTypes.PNG:
    case MimeTypes.JPEG:
    case MimeTypes.JPG:
    case MimeTypes.SVG:
      // eslint-disable-next-line no-case-declarations
      const previewUrl = URL.createObjectURL(file);
      if (previewUrl) {
        return (
          <img
            src={previewUrl}
            data-test-id="image-thumbnail"
            alt="Uploaded file"
            className={styles.uploader__thumbnail__image}
          />
        );
      }
      return <ImageFile className={thumbnailWhenSvg} data-test-id="image" />;
    case MimeTypes.HEIC:
    case MimeTypes.HEIF:
      return <ImageFile className={thumbnailWhenSvg} data-test-id="image" />;
    case MimeTypes.CSV:
    case MimeTypes.TEXT:
      return <TextDocument className={thumbnailWhenSvg} data-test-id="text" />;
    case MimeTypes.MP4:
    case MimeTypes.MOV:
    case MimeTypes.WMV:
    case MimeTypes.AVI:
      return <VideoFile className={thumbnailWhenSvg} data-test-id="video" />;
    case MimeTypes.HTM:
    case MimeTypes.HTML:
      return <HtmlFile className={thumbnailWhenSvg} data-test-id="html" />;
    case MimeTypes.JSON:
      return <JsonFile className={thumbnailWhenSvg} data-test-id="json" />;
    case MimeTypes.MD:
      return (
        <MarkdownFile className={thumbnailWhenSvg} data-test-id="markdown" />
      );
    default:
      return (
        <UnknownDocument className={thumbnailWhenSvg} data-test-id="unknown" />
      );
  }
};

export const getEnumKey = (mimeTypeString) => {
  type MimeTypesKeys = keyof typeof MimeTypes;
  const enumValue: MimeTypesKeys = Object.keys(MimeTypes).find(
    (key) => MimeTypes[key as MimeTypesKeys] === mimeTypeString,
  ) as MimeTypesKeys;

  return MimeTypes[enumValue];
};

export const getMimeTypeKeys = (acceptedMimeTypes: string[]): string[] =>
  Object.keys(MimeTypes)
    .filter((key) =>
      acceptedMimeTypes.includes(MimeTypes[key as keyof typeof MimeTypes]),
    )
    .map((key) => `.${key.toLowerCase()}`);

export const getCanAdd = (multiple, maxFiles, docLength) => {
  if (!multiple) {
    return docLength === 0;
  }
  if (maxFiles !== null) {
    return maxFiles - docLength > 0;
  }
  return true;
};

export const addDocument = (state, code, document) => {
  if (!state[code]) {
    state[code] = [];
  }
  if (!state[code]?.some((obj) => obj.id === document.id)) {
    state[code] = [...state[code], document];
  }
  return state;
};
export const removeDocument = (state, documentId) => {
  state = state.filter((document) => document.id !== documentId);
  return state;
};

export const getSizeUnitFormat = (bytes: number): string => {
  // Input validation
  if (typeof bytes !== 'number' || !Number.isFinite(bytes)) {
    throw new Error('Invalid input: bytes must be a finite number');
  }

  if (bytes < 0) {
    throw new Error('Invalid input: bytes cannot be negative');
  }

  if (bytes === 0) return '0 bytes';

  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  // Handle bytes
  if (bytes < KB) {
    return `${bytes.toFixed(Number.isInteger(bytes) ? 0 : 1)} bytes`;
  }

  // Handle KB
  if (bytes < MB) {
    const kb = bytes / KB;
    return Number.isInteger(kb) ? `${kb} KB` : `${kb.toFixed(1)} KB`;
  }

  // Handle MB
  if (bytes < GB) {
    const mb = bytes / MB;
    return Number.isInteger(mb) ? `${mb} MB` : `${mb.toFixed(1)} MB`;
  }

  // Handle GB
  const gb = bytes / GB;
  return Number.isInteger(gb) ? `${gb} GB` : `${gb.toFixed(1)} GB`;
};

export const generateMultimediaId = () => {
  const min = 1000000000;
  const max = 2147483647;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const isImageMimeType = (type: string) => {
  if (!type || typeof type !== 'string') {
    return false;
  }
  return /^image\/(png|jpeg|jpg|svg\+xml)$/.test(type);
};
