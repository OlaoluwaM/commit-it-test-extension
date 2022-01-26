import { GitExtension, Status } from './git.d';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "commit-it" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand(
  //   'commit-it.helloWorld',

  // );

  const someFun = () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user

    type OutputTupleArray = (readonly [Status, string])[];

    const DESIRED_CHANGE_STATUSES = [
      Status.INDEX_ADDED,
      Status.MODIFIED,
      Status.DELETED,
      Status.UNTRACKED,
    ];

    const gitExtension =
      vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports;

    if (!gitExtension) {
      vscode.window.showInformationMessage(
        `Git is not initialized in this repo`
      );
      return;
    }

    const gitApi = gitExtension.getAPI(1);
    const repo = gitApi.repositories[0];

    const changesInTheWorkingTree: OutputTupleArray =
      repo?.state.workingTreeChanges.map(change => [
        change.status,
        change.uri.path,
      ]);

    const changesInStaging: OutputTupleArray = repo?.state.indexChanges.map(
      change => [change.status, change.uri.path]
    );

    const uncommittedChanges: OutputTupleArray = [
      ...changesInStaging,
      ...changesInTheWorkingTree,
    ].filter(([changeStatus]) =>
      DESIRED_CHANGE_STATUSES.includes(changeStatus)
    );

    const numberOfUncommittedChanges = uncommittedChanges.length;

    if (numberOfUncommittedChanges === 10) {
      vscode.window.showInformationMessage(
        `You have ${uncommittedChanges!.length} uncommitted changes`
      );
    }
    console.log('called');
  };

  setInterval(someFun, 1000);

  // context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

// Useful Links
// https://stackoverflow.com/questions/46511595/how-to-access-the-api-for-git-in-visual-studio-code
// https://github.com/Microsoft/vscode/issues/31103
// https://github.com/Microsoft/vscode/blob/b161ce4305a101a54c3088040fa2dc544755e2d5/extensions/git/src/git.ts
// https://github.com/Microsoft/vscode/blob/main/extensions/git/src/api/git.d.ts
