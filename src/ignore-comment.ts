import { TextDocument } from 'vscode';

export const DISABLE_NEXT_LINE_COMMAND = 'cssrem-disable-next-line';

export function isDisabledNextLineViaText(line: string): boolean {
  return line.includes(DISABLE_NEXT_LINE_COMMAND);
}

export function isDisabledNextLine(
  doc: TextDocument,
  lineNumber: number
): boolean {
  if (lineNumber - 1 < 0) return false;
  const line = doc.lineAt(lineNumber - 1).text.trim();
  return isDisabledNextLineViaText(line);
}
