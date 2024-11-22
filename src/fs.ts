import { Uri, workspace } from 'vscode';

export async function findUri(path?: string): Promise<Uri | undefined> {
  if (!path) {
    return undefined;
  }
  const workspacePaths = (workspace.workspaceFolders ?? []).map((e) =>
    Uri.joinPath(e.uri, path)
  );
  for (const uri of workspacePaths) {
    try {
      await workspace.fs.stat(uri);
      return uri;
    } catch {
      continue;
    }
  }
  return undefined;
}

export function byteArrayToString(value: Uint8Array): string {
  return new TextDecoder().decode(value);
}

export function stringToByteArray(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

export async function readFile(uri: Uri): Promise<string | null> {
  try {
    const contents = await workspace.fs.readFile(uri);
    return byteArrayToString(contents);
  } catch {
    return null;
  }
}
