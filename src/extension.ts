import { commands, ExtensionContext, languages, workspace } from 'vscode';
import CssRemProvider from './completion';
import { cog, cssremConfigFileName, loadConfig } from './config';
import CssRemHoverProvider from './hover';
import { LineAnnotation } from './line-annotation';
import { CssRemProcess } from './process';

let process: CssRemProcess;

export function activate(context: ExtensionContext) {
  loadConfig();
  workspace.onDidChangeConfiguration(() => loadConfig());

  process = new CssRemProcess();

  const LANS = [...cog.languages];
  if (cog.wxss) {
    LANS.push('wxss');
  }
  for (const lan of LANS) {
    const providerDisposable = languages.registerCompletionItemProvider(lan, new CssRemProvider(lan, process));
    context.subscriptions.push(providerDisposable);
  }
  if (cog.hover !== 'disabled') {
    const hoverProvider = new CssRemHoverProvider();
    context.subscriptions.push(languages.registerHoverProvider(LANS, hoverProvider));
  }

  const ignoresViaCommand = ((cog.ignoresViaCommand || []) as string[]).filter(w => !!w).map(v => (v.endsWith('px') ? v : `${v}px`));
  context.subscriptions.push(
    commands.registerTextEditorCommand('extension.cssrem', textEditor => {
      process.modifyDocument(textEditor, ignoresViaCommand, 'pxToRem');
    }),
    commands.registerTextEditorCommand('extension.cssrem.rem-to-px', textEditor => {
      process.modifyDocument(textEditor, ignoresViaCommand, 'remToPx');
    }),
    commands.registerTextEditorCommand('extension.cssrem.rem-switch-px', textEditor => {
      process.modifyDocument(textEditor, ignoresViaCommand, 'pxSwitchRem');
    }),
  );
  if (cog.vw) {
    context.subscriptions.push(
      commands.registerTextEditorCommand('extension.cssrem.px-to-vw', textEditor => {
        process.modifyDocument(textEditor, ignoresViaCommand, 'pxToVw');
      }),
      commands.registerTextEditorCommand('extension.cssrem.vw-to-px', textEditor => {
        process.modifyDocument(textEditor, ignoresViaCommand, 'vwToPx');
      }),
      commands.registerTextEditorCommand('extension.cssrem.vw-switch-px', textEditor => {
        process.modifyDocument(textEditor, ignoresViaCommand, 'vwSwitchPx');
      }),
    );
  }
  if (cog.wxss) {
    context.subscriptions.push(
      commands.registerTextEditorCommand('extension.cssrem.px-to-rpx', textEditor => {
        process.modifyDocument(textEditor, ignoresViaCommand, 'pxToRpx');
      }),
      commands.registerTextEditorCommand('extension.cssrem.rpx-to-px', textEditor => {
        process.modifyDocument(textEditor, ignoresViaCommand, 'rpxToPx');
      }),
      commands.registerTextEditorCommand('extension.cssrem.rpx-switch-px', textEditor => {
        process.modifyDocument(textEditor, ignoresViaCommand, 'rpxSwitchPx');
      }),
    );
  }
  if (cog.currentLine !== 'disabled') context.subscriptions.push(new LineAnnotation());
  // .cssrem watch
  const cssremConfigWatcher = workspace.createFileSystemWatcher(`**/${cssremConfigFileName}`);
  cssremConfigWatcher.onDidChange(() => loadConfig());
  cssremConfigWatcher.onDidCreate(() => loadConfig());
  cssremConfigWatcher.onDidDelete(() => loadConfig());
  context.subscriptions.push(cssremConfigWatcher);
}

// this method is called when your extension is deactivated
export function deactivate() {
  //
}
