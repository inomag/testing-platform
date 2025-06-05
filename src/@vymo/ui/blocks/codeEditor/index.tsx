import React from 'react';
import { Editor } from '@monaco-editor/react';
import { getDefaultOptions } from './queries';

function CodeEditor({
  options = getDefaultOptions(),
  theme = 'vs-dark',
  language = 'js',
  width,
  height,
  value = '',
}: {
  options?: any;
  theme?: string;
  language?: string;
  value?: string;
  width: string;
  height: string;
}) {
  return (
    <Editor
      width={width}
      height={height}
      language={language}
      value={value}
      theme={theme}
      options={options}
    />
  );
}

export default CodeEditor;
