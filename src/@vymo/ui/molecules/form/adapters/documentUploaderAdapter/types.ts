export type Document = {
  id: string;
  mime: string;
  file: File;
  thumbnail?: string;
};

export type FormDocumentUploaderProps = {
  code: string;
  value: Array<{ uri: string; thumbnail?: string }> | string;
  disabled?: boolean;
  onChange: Function;
  multimediaOptions?: Record<string, any>;
};
