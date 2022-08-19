import { position } from "./type";
import * as vscode from "vscode";

export const creageRange = (start: position, end: position): vscode.Range => {
  return new vscode.Range(
    new vscode.Position(...start),
    new vscode.Position(...end)
  );
};

export const createRange = (start: vscode.Position, end: vscode.Position) => {
  return new vscode.Range(start, end);
};

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

  return creageRange(start, end);
};

// show gif
export const showGif = (
  window: typeof vscode.window,
  editor: vscode.TextEditor
): void => {
  const css = objectToCssString({
    position: "absolute",
    // right: "5%",
    top: "20px",

    ["font-family"]: "monospace",
    ["font-weight"]: "900",

    // width: "50px",
    // ["z-index"]: 1,
    ["pointer-events"]: "none",
    ["text-align"]: "right",
    ["width"]: `60vh`,
    ["height"]: `60vh`,
    ["background-repeat"]: "no-repeat",
    ["background-size"]: "cover",
    ["background-position"]: "right",
    ["z-index"]: -1,
    ["right"]: `10vh`,
    ["background-image"]:
      'url("https://raw.githubusercontent.com/1714080902120/dont-stop-coding/main/src/image/that_is_good.png")',
  });

  const textDecoration = window.createTextEditorDecorationType({
    before: {
      contentText: "",
      color: "#fff",
      textDecoration: `none; ${css}`,
    },
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
  });
  const position: vscode.Position = (editor.visibleRanges as vscode.Range[]).sort()[0].start;
  if (position) {
    const range = createRange(position, position);
    editor.setDecorations(textDecoration, [range]);
  }
};

export const objectToCssString = (settings: any): string => {
  let value = "";
  const cssString = Object.keys(settings)
    .map((setting) => {
      value = settings[setting];
      if (typeof value === "string" || typeof value === "number") {
        return `${setting}: ${value};`;
      }
    })
    .join(" ");

  return cssString;
};
