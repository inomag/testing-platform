import { MimeTypes } from './constants';

export type DocumentUploaderProps = {
  acceptedMimeTypes?: Array<MimeTypes>;
  maxSize: number;
  onFileUpload: (files: Document[]) => void;
  onFileRemove: (removedFileName: string, files: Document[]) => void;
  title?: string | React.ReactNode;
  multiple?: boolean;
  fieldCode: string;
  documents?: Document[];
  readOnly?: boolean;
  maxFiles?: null | number;
  // this will give edit and crop functionality when image is uploaded.
  editTool?: boolean;
  link?: { url: string; label: string };
};

export type Document = {
  id: string | number;
  mime: string;
  file: File;
  uri?: string;
  thumbnail?: string;
  size?: number;
  isNew?: boolean;
};

export type DocumentState = Document[];
