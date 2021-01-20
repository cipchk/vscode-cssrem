import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { workspace } from 'vscode';
import { Config } from './interface';
import { resetRules } from './rules';

export let cog!: Config;

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

export function loadConfig(): void {
  cog = workspace.getConfiguration('cssrem') as any;
  loadConfigViaFile();
  resetRules();
}
