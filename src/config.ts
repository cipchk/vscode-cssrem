import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { window, workspace } from 'vscode';
import { Config } from './interface';
import { resetRules } from './rules';

export let cog!: Config;

function loadConfigViaFile(): void {
  if (workspace.workspaceFolders.length === 0) {
    return;
  }

  const cssremConfigPath = join(workspace.workspaceFolders[0].uri.path, '.cssrem');
  if (!existsSync(cssremConfigPath)) {
    console.log(`Not found file: ${cssremConfigPath}`);
    return;
  }
  try {
    const res = JSON.parse(readFileSync(cssremConfigPath).toString('utf-8'));
    cog = {
      ...cog,
      ...res,
    };
    console.warn(`Use override config via ${cssremConfigPath} file`);
  } catch (ex) {
    console.warn(`Parse error in ${cssremConfigPath}`, ex);
  }
}

export function loadConfig(): void {
  cog = workspace.getConfiguration('cssrem') as any;
  loadConfigViaFile();
  resetRules();
}
