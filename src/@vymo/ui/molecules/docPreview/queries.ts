import { MimeTypes } from 'src/@vymo/ui/molecules/documentUploader/constants';

export const getIsFilePreviewSupported = (file: File) => {
  switch (file?.type) {
    case MimeTypes.DOC:
    case MimeTypes.DOCX:
    case MimeTypes.PPT:
    case MimeTypes.PPTX:
    case MimeTypes.XLS:
    case MimeTypes.XLSX:
      return false;

    default:
      return true;
  }
};
