import { position } from "./type";
import * as vscode from "vscode";

export const getRange = (allText: string, deleteNum: number): vscode.Range => {
  const lines = allText.split("\n");

  const linesLength = lines.length;

  const lastLine = lines[linesLength - 1];
  const lastLineLength = lastLine.trim().length;

  // calculate num if enough to delete
  const calc = lastLineLength - deleteNum;

  // get start and end position
  let start: position = [0, 0];
  let end: position = [linesLength, lastLine.length];

  // if it's enough to delete
  if (lastLineLength && calc) {
    start = [linesLength, calc];
  } else {
    // if this line is empty after trim
    for (let i = linesLength - 1; i >= 0; i--) {
      const lineTrim = lines[i].trim();
      const calc = lineTrim.length - deleteNum;
      if (lineTrim.length > 0) {
        if (calc >= 0) {
          start = [i, calc];
          break;
        } else {
          deleteNum = deleteNum + calc;
        }
      }
    }
  }
  console.log(start, end);
  return new vscode.Range(
    new vscode.Position(...start),
    new vscode.Position(...end)
  );
};

// get delete range
export const getDeleteRange = (
  editor: vscode.TextEditor,
  deleteNum: number
): vscode.Range => {

  // get cursor position
  const cursorPosition = editor.selection.active;

  // get start position
  let start: position = [0, 0];
  const end: position = [cursorPosition.line, cursorPosition.character];

  // if it's enough to delete
  const calc = cursorPosition.character - deleteNum;
  if (calc > 0) {
    start = [cursorPosition.line, calc];
  } else {
    // get the left char
    deleteNum = -calc;
    for (let i = cursorPosition.line - 1; i >= 0; i--) {
      const character: number = editor.document.lineAt(i).text.length;

      const nextCalc: number = character - deleteNum;
      if (nextCalc > 0) {
        start = [i, nextCalc];
        break;
      } else {
        deleteNum = -nextCalc;
      }
    }
  }

  return new vscode.Range(
    new vscode.Position(...start),
    new vscode.Position(...end)
  );
};

// show gif
export const showGif = (window: typeof vscode.window, editor: vscode.TextEditor): void => {
  const textDecoration = window.createTextEditorDecorationType({
    overviewRulerLane: 4,
    backgroundColor: 'rgba(0, 0, 0, .5)',
    outline: 'none',
    border: '1px solid #f00',
    textDecoration: 'none',
    gutterIconPath: vscode.Uri.parse('file://')
  });
  editor.setDecorations(textDecoration, );
};
