import React, { useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Convergence } from "@convergence/convergence";
import { CONVERGENCE_URL } from "config";
import MonacoConvergenceAdapter from "./MonacoAdapter";

interface AppProps {
  code: string | undefined;
  setCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  MonacoEditorRef: React.MutableRefObject<any>;
}

const MonacoEditor: React.FC<AppProps> = ({ code, setCode, MonacoEditorRef }) => {
  const handleEditorDidMount = (editor: any) => {
    MonacoEditorRef.current = editor;
  };

  const username = "User1";

  useEffect(() => {
    Convergence.connectAnonymously(CONVERGENCE_URL, username)
      .then((domain) => {
        // Now open the model, creating it using the initial data if it does not exist.
        return domain.models().openAutoCreate({
          collection: "project-caucus`",
          id: "monaco-editor-caucus",
          ephemeral: false,
          data: { text: code },
        });
      })
      .then((model) => {
        const adapter = new MonacoConvergenceAdapter(MonacoEditorRef.current, model.elementAt("text"));
        adapter.bind();
      })
      .catch((error) => {
        console.error("Could not open model ", error);
      });
  }, []);

  return (
    <div style={{ flexGrow: 1, overflow: "hidden" }}>
      <Editor
        onMount={(editor) => handleEditorDidMount(editor)}
        theme="vs-dark"
        defaultLanguage="cpp"
        // value={code}
        // onChange={(value) => setCode(value)}
        options={{ wordWrap: "on" }}
      />
    </div>
  );
};

export default MonacoEditor;