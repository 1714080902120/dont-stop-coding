// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { DELAY, DELETE_NUM } from "./constant";
import { getDeleteRange, hideGif, showGif } from "./utils";

// timer
let timer: any = null;

// is active
let isActive = false;
// had show image
let hadShowImg = false;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('"dont-stop-coding" is now active!');
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  const { window, workspace } = vscode;

  // clear timer
  const clearTimer = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  // hide img
  const hideImg = () => {
    if (hadShowImg) {
      hideGif(window.activeTextEditor as vscode.TextEditor);
      hadShowImg = false;
    }
  }


  const loadPluginCallback = () => {
    // get current active editor
    const editor = window.activeTextEditor;
    if (!editor) {
      return;
    }
    // get document
    const document = editor.document;
    // get text
    let allText = document.getText();
    // get plugin's local config
    let { delay = DELAY, num: deleteNum = DELETE_NUM } =
      workspace.getConfiguration("dontStopCoding.config") || {};

    // editor.edit callback
    const handleDeleteText = (editBuilder: vscode.TextEditorEdit) => {
      if (allText.length <= 0) {
        if (timer) {
          // TODO show gif
          if (!hadShowImg) {
            hadShowImg = true;
            showGif(window, editor);
          }
          // if nothing left, clear timer
          clearTimer();
        }
        return;
      }

      // get range
      const range = getDeleteRange(editor, deleteNum);

      // do delete
      editBuilder.delete(range);
    };

    // start interval action
    const startInterval = () => {
      if (!isActive) {
        return;
      }
      // clear before timer
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      // reset timer
      timer = setInterval(() => {
        editor.edit(handleDeleteText);
      }, delay);
    };

    isActive = true;

    // start interval
    startInterval();

    // listen to textDocument change
    workspace.onDidChangeTextDocument((event) => {
      allText = document.getText();

      // hide img when change
      hideImg();

      startInterval();
    });
  };

  // register open
  let startPlugin = vscode.commands.registerCommand(
    "dont-stop-coding.startPlugin",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "dont-stop-coding plugin is active, enjoy yourself~"
      );

      loadPluginCallback();
      // listen to textEditor change
      window.onDidChangeActiveTextEditor((event) => {
        clearTimer();
        // if not active, do not do delete
        if (!isActive) {
          return;
        }
        loadPluginCallback();
      });
    }
  );

  // register close
  let closePlugin = vscode.commands.registerCommand(
    "dont-stop-coding.closePlugin",
    () => {
      clearTimer();

      // init state
      isActive = false;

      // hide img when change
      hideImg();
      
      vscode.window.showInformationMessage(
        "dont-stop-coding plugin is deactivate, bye~"
      );
    }
  );

  context.subscriptions.push(startPlugin, closePlugin);
}

// this method is called when your extension is deactivated
export function deactivate() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  isActive = false;
  
  hadShowImg = false;

  console.log('"dont-stop-coding" is now deactive!');
}
