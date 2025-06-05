import _ from 'lodash';
import { MimeTypes } from 'src/@vymo/ui/molecules/documentUploader/constants';
import { getEnumKey } from 'src/@vymo/ui/molecules/documentUploader/queries';
import moment from 'moment';
import { DOC_TYPES } from './constant';

export const getDocumentName = (fileExt, index) => {
  let newFileName = '';
  if (fileExt.length === 0) {
    newFileName = `${moment().format('YYYY-MM-DD-hh-mm-ss')}-${index}`;
  } else {
    newFileName = `${moment().format(
      'YYYY-MM-DD-hh-mm-ss',
    )}-${index}.${fileExt}`;
  }
  return newFileName;
};

export const getDocObject = (documents, mediaType) => {
  let renameFile = documents;
  if (mediaType === 'photo') {
    renameFile = _.map(documents, (document, i) => {
      let fileExt = document.file.name.split('.');
      fileExt = fileExt[fileExt.length - 1];
      const newFileName = getDocumentName(fileExt, i);
      const blob = documents[i].file.slice(
        0,
        documents[i].file.size,
        documents[i].file.type,
      );
      renameFile = new File([blob], newFileName, {
        type: documents[i].file.type,
      });
      const origName = documents[i].file.name;
      const fileName = document.file.name;
      fileExt = fileExt.toLowerCase();
      if (DOC_TYPES[fileExt]) {
        renameFile.mime = documents[i].file.type || DOC_TYPES[fileExt];
      }
      return {
        ...document,
        file: renameFile,
        origName,
        fileName,
        label: fileName,
      };
    });
  } else if (mediaType === 'document') {
    renameFile = _.map(documents, (document, i) => {
      // removing all special char and spaces
      let fileExt = document.file.name.split('.');
      fileExt = fileExt[fileExt.length - 1];
      const newFileName = getDocumentName(fileExt, i);
      const blob = documents[i].file.slice(
        0,
        documents[i].file.size,
        documents[i].file.type,
      );
      renameFile = new File([blob], newFileName, {
        type: documents[i].file.type,
      });
      const label = documents[i].file.name;
      const fileName = document.file.name;
      fileExt = fileExt.toLowerCase();
      if (DOC_TYPES[fileExt]) {
        renameFile.mime = documents[i].file.type || DOC_TYPES[fileExt];
      }
      return { ...document, file: renameFile, label, fileName };
    });
  }
  return renameFile;
};

export const convertFileUrlToBlob = async (documents: any, code) =>
  Promise.all(
    documents.map(async (item) => {
      if (!item?.file) {
        const response = await fetch(item.uri);
        const blob = await response.blob();
        const filename = item.uri.split('/').pop()?.split('?')[0] || '';
        const extension = filename.split('.').pop()?.toUpperCase() || '';
        const extensionType = MimeTypes[extension as keyof typeof MimeTypes];
        const type = extensionType || blob.type || 'application/octet-stream';

        const file = new File([blob], filename, { type });
        return {
          ...item,
          id: `${code}-${filename}`,
          file,
          mime: getEnumKey(file.type),
          uri: item.uri,
          thumbnail: item.thumbnail,
        };
      }
      return item;
    }),
  );
