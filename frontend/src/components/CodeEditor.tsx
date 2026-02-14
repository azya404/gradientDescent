// src/components/CodeEditor.tsx
import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  onTyping: () => void;
  setCode: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onTyping, setCode }) => {
  
  const handleEditorChange = (value: string | undefined) => {
    setCode(value);
    onTyping(); // Triggers the "AI is judging" animation
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
      <Editor
        height="100%"
        defaultLanguage="python"
        defaultValue=""
        theme="vs-dark"
        onChange={handleEditorChange}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          roundedSelection: true,
          padding: { top: 20 },
          fontFamily: "'JetBrains Mono', monospace",
        }}
      />
    </div>
  );
};

export default CodeEditor;