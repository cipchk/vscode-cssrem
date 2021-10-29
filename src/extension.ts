import { commands, ExtensionContext, languages, workspace } from 'vscode';
import CssRemProvider from './completion';
import { cog, loadConfig } from './config';
import CssRemHoverProvider from './hover';
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

  const ingoresViaCommand = ((cog.ingoresViaCommand || []) as string[]).filter(w => !!w).map(v => (v.endsWith('px') ? v : `${v}px`));
  context.subscriptions.push(
    commands.registerTextEditorCommand('extension.cssrem', textEditor => {
      process.modifyDocument(textEditor, ingoresViaCommand, 'pxToRem');
    }),
    commands.registerTextEditorCommand('extension.cssrem.rem-to-px', textEditor => {
      process.modifyDocument(textEditor, ingoresViaCommand, 'remToPx');
    }),
    commands.registerTextEditorCommand('extension.cssrem.rem-switch-px', textEditor => {
      process.modifyDocument(textEditor, ingoresViaCommand, 'pxSwitchRem');
    }),
  );
  if (cog.wxss) {
    context.subscriptions.push(
      commands.registerTextEditorCommand('extension.cssrem.px-to-rpx', textEditor => {
        process.modifyDocument(textEditor, ingoresViaCommand, 'pxToRpx');
      }),
      commands.registerTextEditorCommand('extension.cssrem.rpx-to-px', textEditor => {
        process.modifyDocument(textEditor, ingoresViaCommand, 'rpxToPx');
      }),
      commands.registerTextEditorCommand('extension.cssrem.rpx-switch-px', textEditor => {
        process.modifyDocument(textEditor, ingoresViaCommand, 'rpxSwitchPx');
      }),
    );
  }
}

// this method is called when your extension is deactivated
export function deactivate() {
  //
}
