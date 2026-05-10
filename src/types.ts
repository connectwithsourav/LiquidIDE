export interface FileNode {
  id: string;
  name: string;
  language: 'html' | 'css' | 'javascript' | 'json' | 'image' | 'folder';
  content: string; // Text content or data URL for image
  isFolder?: boolean;
  parentId?: string | null;
}

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';
