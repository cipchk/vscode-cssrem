import { existsSync, readFileSync } from 'fs';
import { parse } from 'jsonc-parser';
import { join } from 'path';
import { Uri, workspace } from 'vscode';
import { Config } from './interface';
import { resetRules } from './rules';

export let cog!: Config;
export const cssremConfigFileName = '.cssrem';

function loadConfigViaFile(): void {
  if (workspace.workspaceFolders == null || workspace.workspaceFolders.length === 0) {
    return;
  }

  const cssremConfigPath = join(workspace.workspaceFolders[0].uri.fsPath, cssremConfigFileName);
  if (!existsSync(cssremConfigPath)) {
    console.log(`Not found file: ${cssremConfigPath}`);
    return;
  }
  try {
    const res = parse(readFileSync(cssremConfigPath).toString('utf-8'));
    cog = {
      ...cog,
      ...res,
    };
    console.warn(`Use override config via ${cssremConfigPath} file`);
  } catch (ex) {
    console.warn(`Parse error in ${cssremConfigPath}`, ex);
  }
}

function fixIngores(): void {
  if (!Array.isArray(cog.ingores)) cog.ingores = [];
  if (workspace.workspaceFolders.length === 0) {
    return;
  }
  const rootPath = workspace.workspaceFolders[0].uri.path;
  cog.ingores = cog.ingores.map(p => join(rootPath, p));
}

function fixLanguages(): void {
  if (!Array.isArray(cog.languages)) cog.languages = [];
  if (cog.languages.length > 0) return;
  cog.languages = ['html', 'vue', 'css', 'postcss', 'less', 'scss', 'sass', 'stylus', 'javascriptreact', 'typescriptreact'];
}

export function loadConfig(): void {
  cog = { ...(workspace.getConfiguration('cssrem') as any) };
  Object.keys(cog).forEach(key => {
    if (typeof cog[key] === 'function') delete cog[key];
  });
  loadConfigViaFile();
  fixIngores();
  fixLanguages();
  resetRules();
  console.log('Current config', cog);
}

export function isIngore(uri: Uri) {
  return cog.ingores.some(p => uri.path.startsWith(p));
}
