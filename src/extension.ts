import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { commands, ExtensionContext, languages, Position, Range, Selection, TextEditor, window, workspace } from 'vscode';
import CssRemProvider from './completion';
import CssRemHoverProvider from './hover';
import { Config, Type } from './interface';
import { CssRemProcess } from './process';
import { resetRules } from './rules';

let cog: Config = null;
let process: CssRemProcess;

function loadConfigViaFile(): void {
  if (workspace.workspaceFolders.length === 0) {
    return;
  }

  const cssremConfigPath = join(workspace.workspaceFolders[0].uri.path, '.cssrem');
  if (!existsSync(cssremConfigPath)) {
    return;
  }
  try {
    const res = JSON.parse(readFileSync(cssremConfigPath).toString('utf-8'));
    cog = {
      ...cog,
      ...res,
    };
  } catch {
    //
  }
}

function loadConfig(): void {
  cog = workspace.getConfiguration('cssrem') as any;
  loadConfigViaFile();
  resetRules(cog);
}

function modifyDocument(textEditor: TextEditor, ingoresViaCommand: string[], type: Type): void {
  const doc = textEditor.document;
  let selection: Selection | Range = textEditor.selection;
  if (selection.isEmpty) {
    const start = new Position(0, 0);
    const end = new Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length);
    selection = new Range(start, end);
  }

  const text = doc.getText(selection);
  textEditor.edit(builder => {
    builder.replace(selection, process.convertAll(text, ingoresViaCommand, type));
  });
}

export function activate(context: ExtensionContext) {
  loadConfig();
  workspace.onDidChangeConfiguration(() => loadConfig());

  process = new CssRemProcess(cog);

  const LANS = ['html', 'vue', 'css', 'postcss', 'less', 'scss', 'sass', 'stylus'];
  if (cog.wxss) {
    LANS.push('wxss');
  }
  for (const lan of LANS) {
    const providerDisposable = languages.registerCompletionItemProvider(lan, new CssRemProvider(cog, lan, process));
    context.subscriptions.push(providerDisposable);
  }
  if (cog.hover !== 'disabled') {
    const hoverProvider = new CssRemHoverProvider(cog);
    context.subscriptions.push(languages.registerHoverProvider(LANS, hoverProvider));
  }

  const ingoresViaCommand = ((cog.ingoresViaCommand || []) as string[]).filter(w => !!w).map(v => (v.endsWith('px') ? v : `${v}px`));
  context.subscriptions.push(
    commands.registerTextEditorCommand('extension.cssrem', textEditor => {
      modifyDocument(textEditor, ingoresViaCommand, 'pxToRem');
    }),
    commands.registerTextEditorCommand('extension.cssrem.rem-to-px', textEditor => {
      modifyDocument(textEditor, ingoresViaCommand, 'remToPx');
    }),
  );
  if (cog.wxss) {
    context.subscriptions.push(
      commands.registerTextEditorCommand('extension.cssrem.px-to-rpx', textEditor => {
        modifyDocument(textEditor, ingoresViaCommand, 'pxToRpx');
      }),
      commands.registerTextEditorCommand('extension.cssrem.rpx-to-px', textEditor => {
        modifyDocument(textEditor, ingoresViaCommand, 'rpxToPx');
      }),
    );
  }
}

// this method is called when your extension is deactivated
export function deactivate() {
  //
}
