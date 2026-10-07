export type WorkspaceTab = 'preview' | 'files' | 'code' | 'more';

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileNode[];
}
