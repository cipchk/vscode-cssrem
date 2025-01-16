import * as JSONC from 'jsonc-parser';
import { Uri, workspace } from 'vscode';
import { Config } from './interface';
import { resetRules } from './rules';
import { minimatch } from 'minimatch';
import { findUri, readFile } from './fs';

export let cog!: Config;
export const cssremConfigFileName = '.cssrem';

async function loadConfigViaFile(): Promise<void> {
  if (
    workspace.workspaceFolders == null ||
    workspace.workspaceFolders?.length <= 0
  ) {
    return;
  }

  const cssremConfigUri = await findUri(cssremConfigFileName);
  if (cssremConfigUri == null) {
    console.log(`Not found file: ${cssremConfigUri}`);
    return;
  }
  const cogText = await readFile(cssremConfigUri);
  if (cogText == null) {
    console.log(`Can't read file: ${cssremConfigUri}`);
    return;
  }
  try {
    const res = JSONC.parse(cogText);
    cog = {
      ...cog,
      ...res,
    };
    console.warn(`Use override config via ${cssremConfigUri} file`);
  } catch (ex) {
    console.warn(`Parse error in ${cssremConfigUri}`, ex);
  }
}

function fixIngores(): void {
  if (!Array.isArray(cog.ignores)) cog.ignores = [];
}

function fixLanguages(): void {
  if (!Array.isArray(cog.languages)) cog.languages = [];
  if (cog.languages.length > 0) return;
  cog.languages = [
    'html',
    'vue',
    'css',
    'postcss',
    'less',
    'scss',
    'sass',
    'stylus',
    'tpl',
    'wxss',
    'twig',
    'javascriptreact',
    'typescriptreact',
    'javascript',
    'typescript',
  ];
}

export async function loadConfig(): Promise<void> {
  cog = { ...(workspace.getConfiguration('cssrem') as any) };
  Object.keys(cog).forEach((key) => {
    if (typeof (cog as any)[key] === 'function') delete (cog as any)[key];
  });
  await loadConfigViaFile();
  fixIngores();
  fixLanguages();
  resetRules();
  console.log('Current config', cog);
}

export function isIngore(uri: Uri) {
  return cog.ignores.some((p) => minimatch(uri.path, p));
}

export function testConfig(c: Partial<Config>) {
  cog = { ...c } as unknown as Config;
  fixIngores();
  fixLanguages();
  resetRules();
}
