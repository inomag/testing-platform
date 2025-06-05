import React, { useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

function MonacoEditor() {
  const editorRef = useRef(null);

  const handleEditorWillMount = (monacoInstance) => {
    // Register JavaScript language features (if needed)
    monacoInstance.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
    });
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const code = editor.getValue();

      const markers = [];
      if (!code.trim().endsWith(';')) {
        // @ts-ignore
        markers.push({
          severity: monaco.MarkerSeverity.Warning,
          message: 'Consider adding a semicolon at the end.',
          startLineNumber: code.split('\n').length,
          startColumn: code.length,
          endLineNumber: code.split('\n').length,
          endColumn: code.length + 1,
        } as any);
      }

      monaco.editor.setModelMarkers(editor.getModel(), 'javascript', markers);
    });
  };

  return (
    <Editor
      width="400px"
      height="200px"
      language="javascript"
      value="const saveQuery = (data, formData) => {}"
      theme="vs-dark"
      options={{
        autoDetectHighContrast: true,
        scrollBeyondLastLine: false,
        fontSize: 16,
        minimap: { enabled: false }, // Disable the minimap for better visibility
        automaticLayout: true, // Auto-adjust layout when container resizes
      }}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
    />
  );
}

export default MonacoEditor;
