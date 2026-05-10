import React, { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import JSZip from 'jszip';
import {
  Download,
  Upload,
  Monitor,
  Smartphone,
  Tablet,
  FileCode2,
  FileJson,
  X,
  FolderPlus,
  Folder,
  FolderOpen,
  Image as ImageIcon,
  Trash2,
  Plus,
  Settings,
  User,
  RefreshCw,
  Expand,
  Menu,
  ChevronRight,
  ChevronDown,
  Undo,
  Redo,
  Edit2,
  MoreVertical,
  Copy,
  Scissors,
  ClipboardPaste,
  ListCollapse,
  Maximize,
  Minimize,
  Droplet,
} from 'lucide-react';
import { FileNode, DeviceMode } from './types';
import { INITIAL_FILES } from './constants';
import { cn } from './lib/utils';
import * as monaco from 'monaco-editor';

export default function App() {
  const [files, setFiles] = useState<FileNode[]>(INITIAL_FILES);
  const [activeFileId, setActiveFileId] = useState<string | null>('index.html');
  const [openFileIds, setOpenFileIds] = useState<string[]>([
    'index.html',
    'style.css',
    'script.js',
  ]);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [previewKey, setPreviewKey] = useState(0); // For forcing iframe refresh
  const [dialog, setDialog] = useState<{
    type: 'file' | 'folder' | 'delete' | 'alert' | 'rename' | 'rename_project';
    targetId?: string;
    message?: string;
    initValue?: string;
    parentId?: string | null;
  } | null>(null);
  const [dialogInput, setDialogInput] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, folderId: string } | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('my-creative-portfolio');
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState<{ type: string, message: string }[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const resizeContainerRef = useRef<HTMLDivElement>(null);
  
  // Resizer state for pane
  const [previewPaneWidthPercent, setPreviewPaneWidthPercent] = useState(40);
  const [isDraggingPane, setIsDraggingPane] = useState(false);

  const handlePaneResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingPane(true);
  }, []);

  const handlePaneResizeMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingPane) return;
      // Subtract Sidebar width 200px before calculating percentage
      const totalWorkspaceWidth = window.innerWidth - 200;
      const mouseX = e.clientX - 200; // relative to workspace
      const newWidthPercent = 100 - (mouseX / totalWorkspaceWidth) * 100;
      // Constrain the percent between 20 and 80
      setPreviewPaneWidthPercent(Math.min(Math.max(newWidthPercent, 20), 80));
    },
    [isDraggingPane]
  );

  const handlePaneResizeMouseUp = useCallback(() => {
    setIsDraggingPane(false);
  }, []);

  // Resizer state for full screen preview
  const [previewWidth, setPreviewWidth] = useState(1024);
  const [isDraggingWidth, setIsDraggingWidth] = useState(false);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingWidth(true);
  }, []);

  const handleResizeMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingWidth) return;
      if (resizeContainerRef.current) {
        const rect = resizeContainerRef.current.getBoundingClientRect();
        // Constrain width between 320px and 1440px
        const newWidth = Math.min(Math.max(e.clientX - rect.left, 320), 1440);
        setPreviewWidth(Math.round(newWidth));
      }
    },
    [isDraggingWidth]
  );

  const handleResizeMouseUp = useCallback(() => {
    setIsDraggingWidth(false);
  }, []);

  useEffect(() => {
    if (isDraggingWidth) {
      window.addEventListener('mousemove', handleResizeMouseMove);
      window.addEventListener('mouseup', handleResizeMouseUp);
      document.body.style.userSelect = 'none';
      
      // Send message to iframe to disable pointer events so we can drag over it
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
         iframe.style.pointerEvents = 'none';
      });
    } else {
      window.removeEventListener('mousemove', handleResizeMouseMove);
      window.removeEventListener('mouseup', handleResizeMouseUp);
      document.body.style.userSelect = '';
      
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
         iframe.style.pointerEvents = 'auto';
      });
    }

    return () => {
      window.removeEventListener('mousemove', handleResizeMouseMove);
      window.removeEventListener('mouseup', handleResizeMouseUp);
      document.body.style.userSelect = '';
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
         iframe.style.pointerEvents = 'auto';
      });
    };
  }, [isDraggingWidth, handleResizeMouseMove, handleResizeMouseUp]);

  useEffect(() => {
    if (isDraggingPane) {
      window.addEventListener('mousemove', handlePaneResizeMouseMove);
      window.addEventListener('mouseup', handlePaneResizeMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
         iframe.style.pointerEvents = 'none';
      });
    } else {
      window.removeEventListener('mousemove', handlePaneResizeMouseMove);
      window.removeEventListener('mouseup', handlePaneResizeMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
         iframe.style.pointerEvents = 'auto';
      });
    }
    return () => {
      window.removeEventListener('mousemove', handlePaneResizeMouseMove);
      window.removeEventListener('mouseup', handlePaneResizeMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
         iframe.style.pointerEvents = 'auto';
      });
    };
  }, [isDraggingPane, handlePaneResizeMouseMove, handlePaneResizeMouseUp]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const monacoInstance = useMonaco();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const activeFile = files.find((f) => f.id === activeFileId);
  const openFiles = openFileIds
    .map((id) => files.find((f) => f.id === id))
    .filter(Boolean) as FileNode[];

  // Define custom theme for Monaco
  useEffect(() => {
    const handleClick = () => {
      setContextMenu(null);
    };
    window.addEventListener('click', handleClick);

    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'CONSOLE_MESSAGE') {
        setLogs((prev) => [...prev, e.data.payload]);
      } else if (e.data && e.data.type === 'CONSOLE_ERROR') {
        setLogs((prev) => [...prev, { type: 'error', message: e.data.payload }]);
      }
    };
    window.addEventListener('message', handleMessage);

    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      if (e.reason?.name === 'Canceled' || (e.reason?.type === 'cancelation' && e.reason?.msg === 'operation is manually canceled')) {
        e.preventDefault();
      }
    };
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    const handleFullscreenChange = () => {
      setIsPreviewFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    if (monacoInstance) {
      monacoInstance.editor.defineTheme('sleek-vs-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [{ background: '00000000', token: '' }],
        colors: {
          'editor.background': '#00000000',
          'editor.lineHighlightBackground': '#ffffff0a',
          'editorLineNumber.foreground': '#858585',
          'editorIndentGuide.background': '#ffffff1a',
          'editor.selectionBackground': '#ffffff2a',
        },
      });
      monacoInstance.editor.setTheme('sleek-vs-dark');
    }

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [monacoInstance]);

  const handleEditorChange = (value: string | undefined) => {
    if (!activeFileId || value === undefined) return;
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, content: value } : f))
    );
  };

  const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  const formatCode = () => {
    editorRef.current?.getAction('editor.action.formatDocument')?.run();
  };

  const undoCode = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      editorRef.current.trigger('source', 'undo', null);
      setPreviewKey((k) => k + 1);
    }
  };

  const redoCode = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      editorRef.current.trigger('source', 'redo', null);
      setPreviewKey((k) => k + 1);
    }
  };

  const handleRenameNode = (
    e: React.MouseEvent,
    id: string,
    currentName: string
  ) => {
    e.stopPropagation();
    setDialog({ type: 'rename', targetId: id, initValue: currentName });
    setDialogInput(currentName);
  };

  const confirmRename = (id: string, newName: string) => {
    if (!newName) return;
    const existing = files.find(
      (f) =>
        f.name === newName &&
        f.id !== id &&
        f.parentId === files.find((curr) => curr.id === id)?.parentId
    );
    if (existing) {
      setDialog({
        type: 'alert',
        message: 'Name already exists in this folder!',
      });
      return;
    }
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: newName } : f))
    );
    setDialog(null);
  };

  const handleSelectFile = (id: string) => {
    if (!openFileIds.includes(id)) {
      setOpenFileIds((prev) => [...prev, id]);
    }
    setActiveFileId(id);
  };

  const handleCloseFile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newOpenFiles = openFileIds.filter((fid) => fid !== id);
    setOpenFileIds(newOpenFiles);
    if (activeFileId === id) {
      setActiveFileId(
        newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null
      );
    }
  };

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const toggleFolder = (e: React.MouseEvent, folderId: string) => {
    e.stopPropagation();
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const collapseAllFolders = () => {
    setExpandedFolders(new Set());
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    let language: FileNode['language'] = 'javascript';
    if (file.name.endsWith('.html')) language = 'html';
    else if (file.name.endsWith('.css')) language = 'css';
    else if (file.name.endsWith('.json')) language = 'json';

    const newFile: FileNode = {
      id: `${file.name}-${Date.now()}`,
      name: file.name,
      language,
      content,
      parentId: selectedFolderId,
    };

    setFiles((prev) => {
      // Allow multiple files with same name in different folders by relying on ID, avoiding strict dup block
      if (prev.find((f) => f.name === newFile.name && f.parentId === newFile.parentId)) return prev;
      return [...prev, newFile];
    });

    setOpenFileIds((prev) => {
      if (!prev.includes(newFile.id)) return [...prev, newFile.id];
      return prev;
    });
    // Ensure parent is expanded
    if (selectedFolderId) {
      setExpandedFolders(prev => new Set(prev).add(selectedFolderId));
    }
    setActiveFileId(newFile.id);
    if (fileUploadRef.current) fileUploadRef.current.value = '';
  };

  const handleCreateNewFolder = () => {
    setDialog({ type: 'folder', parentId: selectedFolderId });
    setDialogInput('');
  };

  const confirmCreateFolder = (name: string) => {
    if (!name) return;
    const targetParentId = dialog?.parentId || selectedFolderId || null;
    const existing = files.find((f) => f.name === name && f.isFolder && f.parentId === targetParentId);
    if (existing) {
      setDialog({ type: 'alert', message: 'Folder already exists in this location!' });
      return;
    }
    const newFolder: FileNode = {
      id: `folder-${Date.now()}`,
      name,
      language: 'folder',
      content: '',
      isFolder: true,
      parentId: targetParentId,
    };
    if (targetParentId) {
      setExpandedFolders(prev => new Set(prev).add(targetParentId));
    }
    setFiles((prev) => [...prev, newFolder]);
    setDialog(null);
  };

  const handleDeleteNode = (e: React.MouseEvent, id: string): void => {
    e.stopPropagation();
    setDialog({ type: 'delete', targetId: id });
  };

  const confirmDelete = (id: string): void => {
    const toDelete = new Set<string>();
    toDelete.add(id);
    const gatherChildren = (parentId: string): void => {
      files.forEach((f) => {
        if (f.parentId === parentId) {
          toDelete.add(f.id);
          gatherChildren(f.id);
        }
      });
    };
    gatherChildren(id);
    setFiles((prev) => prev.filter((f) => !toDelete.has(f.id)));
    setOpenFileIds((prev) => prev.filter((fid) => !toDelete.has(fid)));
    if (activeFileId && toDelete.has(activeFileId)) setActiveFileId(null);
    setDialog(null);
  };

  const renderEditorContent = () => {
    if (!activeFile) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-[#858585]">
          <FileCode2 size={48} className="mb-4 opacity-20" />
          <p className="text-[13px]">Select a file to edit</p>
        </div>
      );
    }

    if (activeFile.language === 'image') {
      return (
        <div className="flex-1 w-full h-full flex items-center justify-center bg-transparent p-8">
          <img
            src={activeFile.content}
            alt={activeFile.name}
            className="max-w-full max-h-full object-contain drop-shadow-2xl rounded"
          />
        </div>
      );
    }

    return (
      <Editor
        height="100%"
        path={activeFile.id}
        language={activeFile.language}
        value={activeFile.content}
        theme="sleek-vs-dark"
        onChange={handleEditorChange}
        onMount={handleEditorMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
          fontLigatures: true,
          wordWrap: 'on',
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          formatOnPaste: true,
        }}
      />
    );
  };

  const getDialogTitle = () => {
    switch (dialog?.type) {
      case 'rename': return 'Rename';
      case 'rename_project': return 'Rename Project';
      case 'file': return 'New File';
      case 'folder': return 'New Folder';
      default: return '';
    }
  };

  const getDialogPlaceholder = () => {
    switch (dialog?.type) {
      case 'rename': return 'New name';
      case 'rename_project': return 'Project name';
      case 'file': return 'e.g. index.html, style.css';
      case 'folder': return 'Folder name';
      default: return '';
    }
  };

  const submitDialogForm = () => {
    if (!dialogInput.trim()) return;
    if (dialog?.type === 'rename_project') {
      setProjectName(dialogInput.trim());
      setDialog(null);
    } else if (dialog?.type === 'rename' && dialog.targetId) {
      confirmRename(dialog.targetId, dialogInput.trim());
    } else if (dialog?.type === 'file') {
      confirmCreateFile(dialogInput.trim());
    } else if (dialog?.type === 'folder') {
      confirmCreateFolder(dialogInput.trim());
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      setDialog({
        type: 'alert',
        message: 'Only jpg, png, and webp are supported',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const targetParentId = selectedFolderId || null;
      const newFile: FileNode = {
        id: `${file.name}-${Date.now()}`,
        name: file.name,
        language: 'image',
        content,
        parentId: targetParentId,
      };
      setFiles((prev) => {
        if (prev.find((f) => f.name === newFile.name && f.parentId === newFile.parentId)) return prev;
        return [...prev, newFile];
      });
      if (!openFileIds.includes(newFile.id)) {
        setOpenFileIds((prev) => [...prev, newFile.id]);
      }
      if (targetParentId) {
        setExpandedFolders(prev => new Set(prev).add(targetParentId));
      }
      setActiveFileId(newFile.id);
    };
    reader.readAsDataURL(file);
    if (imageUploadRef.current) imageUploadRef.current.value = '';
  };

  const handleCreateFile = () => {
    setDialog({ type: 'file', parentId: selectedFolderId });
    setDialogInput('');
  };

  const confirmCreateFile = (name: string) => {
    if (!name) return;
    const targetParentId = dialog?.parentId || selectedFolderId || null;
    const existing = files.find((f) => f.name === name && f.parentId === targetParentId);
    if (existing) {
      setDialog({ type: 'alert', message: 'File already exists in this location!' });
      return;
    }

    let language: FileNode['language'] = 'javascript';
    if (name.endsWith('.html')) language = 'html';
    else if (name.endsWith('.css')) language = 'css';
    else if (name.endsWith('.json')) language = 'json';
    else if (name.match(/\.(jpg|jpeg|png|webp)$/i)) language = 'image';

    const newFile: FileNode = {
      id: `${name}-${Date.now()}`,
      name,
      language,
      content: '',
      parentId: targetParentId,
    };

    if (targetParentId) {
      setExpandedFolders(prev => new Set(prev).add(targetParentId));
    }
    setFiles((prev) => [...prev, newFile]);
    setOpenFileIds((prev) => [...prev, newFile.id]);
    setActiveFileId(newFile.id);
    setDialog(null);
  };

  const exportZip = async () => {
    const zip = new JSZip();
    files.forEach((f) => {
      zip.file(f.name, f.content);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportHtml = () => {
    const htmlContent = generatePreviewHtml();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.zip')) {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      const newFiles: FileNode[] = [];

      for (const [filename, zipEntry] of Object.entries(contents.files)) {
        if (!zipEntry.dir) {
          const content = await zipEntry.async('text');
          let language: FileNode['language'] = 'javascript';
          if (filename.endsWith('.html')) language = 'html';
          else if (filename.endsWith('.css')) language = 'css';
          else if (filename.endsWith('.json')) language = 'json';

          newFiles.push({
            id: filename,
            name: filename,
            language,
            content,
          });
        }
      }
      if (newFiles.length > 0) {
        setFiles(newFiles);
        setOpenFileIds(newFiles.map((f) => f.id).slice(0, 3));
        setActiveFileId(newFiles[0].id);
      }
    } else if (file.name.endsWith('.html')) {
      const content = await file.text();
      const newFile: FileNode = {
        id: file.name,
        name: file.name,
        language: 'html',
        content,
      };
      setFiles([newFile]);
      setOpenFileIds([newFile.id]);
      setActiveFileId(newFile.id);
    }
  };

  const generatePreviewHtml = (): string => {
    const htmlFile =
      files.find((f) => f.name.endsWith('.html')) ||
      files.find((f) => f.language === 'html');
    const cssFiles = files.filter((f) => f.language === 'css');
    const jsFiles = files.filter(
      (f) => f.language === 'javascript' || f.language === 'json'
    );

    let content: string = htmlFile
      ? htmlFile.content
      : '<!DOCTYPE html><html><body><h1>No HTML File Found</h1></body></html>';

    // Inject Interceptor for Console
    const interceptorScript = `
<script>
  window.onerror = function(message, source, lineno, colno, error) {
    window.parent.postMessage({ type: 'CONSOLE_ERROR', payload: message }, '*');
    return false;
  };
  const originalLog = console.log;
  console.log = function(...args) {
    window.parent.postMessage({ type: 'CONSOLE_MESSAGE', payload: { type: 'log', message: args.join(' ') } }, '*');
    originalLog.apply(console, args);
  };
  const originalError = console.error;
  console.error = function(...args) {
    window.parent.postMessage({ type: 'CONSOLE_MESSAGE', payload: { type: 'error', message: args.join(' ') } }, '*');
    originalError.apply(console, args);
  };
</script>
`;

    if (content.includes('<head>')) {
      content = content.replace('<head>', `<head>\n${interceptorScript}`);
    } else {
      content = `${interceptorScript}\n${content}`;
    }

    // Inject CSS
    if (cssFiles.length > 0) {
      const cssInject = cssFiles
        .map((f) => `<style>\n/* ${f.name} */\n${f.content}\n</style>`)
        .join('\n');
      if (content.includes('</head>')) {
        content = content.replace('</head>', `${cssInject}\n</head>`);
      } else {
        content = `${cssInject}\n${content}`;
      }
    }

    // Inject JS
    if (jsFiles.length > 0) {
      const jsInject = jsFiles
        .map((f) => `<script>\n/* ${f.name} */\n${f.content}\n</script>`)
        .join('\n');
      if (content.includes('</body>')) {
        content = content.replace('</body>', `${jsInject}\n</body>`);
      } else {
        content = `${content}\n${jsInject}`;
      }
    }

    return content;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      previewContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const FileIcon = ({
    name,
    language,
    isFolder,
    expanded,
  }: {
    name: string;
    language?: string;
    isFolder?: boolean;
    expanded?: boolean;
  }) => {
    if (isFolder)
      return expanded ? (
        <FolderOpen size={14} className="text-blue-400" />
      ) : (
        <Folder size={14} className="text-blue-400" />
      );
    if (language === 'image' || name.match(/\.(jpg|jpeg|png|webp)$/i))
      return <ImageIcon size={14} className="text-green-400" />;
    if (name.endsWith('.js') || name.endsWith('.ts') || name.endsWith('.json'))
      return <FileJson size={14} className="text-yellow-400" />;
    if (name.endsWith('.css'))
      return <FileCode2 size={14} className="text-blue-400" />;
    if (name.endsWith('.html'))
      return <FileCode2 size={14} className="text-orange-500" />;
    return <FileCode2 size={14} className="text-gray-400" />;
  };

  const renderTree = (parentId: string | null = null, level: number = 0): React.ReactNode => {
    let nodes: FileNode[] = files.filter((f) => (f.parentId || null) === parentId);
    
    if (searchQuery && level === 0) {
      nodes = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    } else if (searchQuery) {
      return null;
    }

    nodes.sort((a, b) => {
      if (a.isFolder === b.isFolder) return a.name.localeCompare(b.name);
      return a.isFolder ? -1 : 1;
    });

    return nodes.map((f) => (
      <div key={f.id}>
        <div
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('nodeId', f.id);
          }}
          onDragOver={(e) => {
            if (f.isFolder) e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const sourceId = e.dataTransfer.getData('nodeId');
            if (sourceId && sourceId !== f.id && f.isFolder) {
              // Check to prevent recursive nesting (moving parent info child)
              let current: string | null | undefined = f.id;
              let isInvalidMove: boolean = false;
              while (current) {
                if (current === sourceId) {
                  isInvalidMove = true;
                  break;
                }
                const folder = files.find((file) => file.id === current);
                current = folder?.parentId;
              }
              if (!isInvalidMove) {
                setFiles((prev) =>
                  prev.map((file) =>
                    file.id === sourceId ? { ...file, parentId: f.id } : file
                  )
                );
                setExpandedFolders((prev) => new Set(prev).add(f.id));
              }
            }
          }}
          className={cn(
            'group flex items-center justify-between py-1 transition-colors cursor-pointer text-[13px] outline-none',
            activeFileId === f.id && !f.isFolder
              ? 'bg-white/10 text-white'
              : selectedFolderId === f.id && f.isFolder
                ? 'bg-[#2a2d3e] text-white'
                : 'hover:bg-white/5 text-white/70'
          )}
          style={{ paddingLeft: `${level * 16 + 12}px`, paddingRight: '12px' }}
          onClick={(e) => {
            if (f.isFolder) {
              toggleFolder(e, f.id);
              setSelectedFolderId(f.id);
            } else {
              handleSelectFile(f.id);
              setSelectedFolderId(f.parentId || null);
            }
          }}
          onContextMenu={(e) => {
            if (f.isFolder) {
              e.preventDefault();
              e.stopPropagation();
              setSelectedFolderId(f.id);
              setContextMenu({ x: e.clientX, y: e.clientY, folderId: f.id });
            }
          }}
        >
          <div className="flex items-center gap-1.5 overflow-hidden flex-1">
            {f.isFolder ? (
              expandedFolders.has(f.id) ? (
                <ChevronDown size={14} className="text-white/50 shrink-0" />
              ) : (
                <ChevronRight size={14} className="text-white/50 shrink-0" />
              )
            ) : (
              <span className="w-[14px] shrink-0" />
            )}
            <FileIcon
              name={f.name}
              language={f.language}
              isFolder={f.isFolder}
              expanded={expandedFolders.has(f.id)}
            />
            <span className="truncate" title={f.name}>
              {f.name}
            </span>
          </div>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1">
            <button
              onClick={(e) => handleRenameNode(e, f.id, f.name)}
              className="p-1 rounded hover:bg-white/20 text-white/50 hover:text-white"
              title="Rename"
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={(e) => handleDeleteNode(e, f.id)}
              className="p-1 rounded hover:bg-white/20 text-white/50 hover:text-white"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
        {f.isFolder && expandedFolders.has(f.id) && renderTree(f.id, level + 1)}
      </div>
    ));
  };

  const renderDialog = () => {
    if (!dialog) return null;
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1e1e2f] border border-white/10 rounded-lg shadow-2xl p-5 min-w-[300px] text-white">
            {dialog.type === 'alert' && (
              <>
                <h3 className="text-sm font-semibold mb-3">Alert</h3>
                <p className="text-sm text-gray-300 mb-4">{dialog.message}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setDialog(null)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs transition-colors"
                  >
                    OK
                  </button>
                </div>
              </>
            )}
            {dialog.type === 'delete' && (
              <>
                <h3 className="text-sm font-semibold mb-3">Confirm Delete</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Are you sure you want to delete this?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setDialog(null)}
                    className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      dialog.targetId && confirmDelete(dialog.targetId)
                    }
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-500 rounded text-xs transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
            {(dialog.type === 'file' ||
              dialog.type === 'folder' ||
              dialog.type === 'rename' ||
              dialog.type === 'rename_project') && (
              <>
                <h3 className="text-sm font-semibold mb-3">
                  {getDialogTitle()}
                </h3>
                <input
                  type="text"
                  value={dialogInput}
                  onChange={(e) => setDialogInput(e.target.value)}
                  placeholder={getDialogPlaceholder()}
                  className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white mb-4 outline-none focus:border-blue-500 transition-colors"
                  autoFocus
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitDialogForm();
                    else if (e.key === 'Escape') setDialog(null);
                  }}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setDialog(null)}
                    className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitDialogForm}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs transition-colors"
                  >
                    {dialog.type === 'rename' || dialog.type === 'rename_project' ? 'Rename' : 'Create'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
    );
  };

  const getActiveBreakpoint = (currentWidth: number) => {
    if (currentWidth < 480) return 'MOBILE';
    if (currentWidth < 768) return 'TABLET';
    if (currentWidth < 1024) return 'LAPTOP';
    if (currentWidth < 1440) return 'DESKTOP';
    return 'LARGEDESKTOP';
  };

  const activeModeResizer = getActiveBreakpoint(previewWidth);

  const smoothTransition = isDraggingWidth
    ? 'transition-none'
    : 'transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]';

  const smoothWidthTransition = isDraggingWidth
    ? 'transition-none'
    : 'transition-[width] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]';

  const currentWidthColor = activeModeResizer === 'MOBILE' ? 'bg-pink-600' :
                            activeModeResizer === 'TABLET' ? 'bg-indigo-600' :
                            activeModeResizer === 'LAPTOP' ? 'bg-indigo-400' : 
                            activeModeResizer === 'DESKTOP' ? 'bg-indigo-500' : 'bg-purple-600';

  const renderBreakpointButton = (mode: string, targetWidth: number, label: string, sublabel: string) => {
    const isActive = activeModeResizer === mode;
    return (
      <button
        key={mode}
        onClick={() => setPreviewWidth(targetWidth)}
        className={`relative flex flex-col items-center justify-center px-6 py-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer overflow-hidden ${
          isActive ? 'text-white shadow-xl scale-110 z-10' : 'text-slate-500 hover:bg-white/80 hover:scale-105'
        }`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-r from-pink-500 to-indigo-500 transition-opacity duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <span className="relative z-10 font-bold text-sm">{label}</span>
        <span className="relative z-10 text-[10px] opacity-80 mb-[-2px]">{sublabel}</span>
      </button>
    );
  };

  return (
    <div 
      className="h-[100dvh] w-full bg-[#0b1326] text-[#cccccc] font-sans flex flex-col overflow-hidden relative"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(0, 242, 255, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(255, 36, 228, 0.15) 0%, transparent 40%)
        `,
      }}
    >
      {/* Ambient lighting elements */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[rgba(255,172,232,0.1)] blur-[24px] translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-[rgba(225,253,255,0.1)] blur-[24px] -translate-x-1/2 translate-y-1/2 pointer-events-none z-0"></div>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="absolute z-[100] w-48 bg-[#1e1e2f] border border-white/10 rounded-md shadow-2xl py-1 text-sm text-white"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button 
            className="w-full text-left px-4 py-1.5 hover:bg-white/10 flex items-center gap-2"
            onClick={() => {
              setDialog({ type: 'file', parentId: contextMenu.folderId });
              setDialogInput('');
            }}
          >
            <FileCode2 size={14} /> New File
          </button>
          <button 
            className="w-full text-left px-4 py-1.5 hover:bg-white/10 flex items-center gap-2"
            onClick={() => {
              setSelectedFolderId(contextMenu.folderId);
              imageUploadRef.current?.click();
            }}
          >
            <ImageIcon size={14} /> Upload Image
          </button>
        </div>
      )}

      {/* Global Drag Overlay to guarantee mouseup capture */}
      {(isDraggingPane || isDraggingWidth) && (
        <div className="fixed inset-0 z-[99999] cursor-ew-resize" />
      )}

      {renderDialog()}

      {/* Header / Toolbar */}
      <header className="h-[72px] border-b border-white/10 bg-[#0f172a]/90 backdrop-blur-md flex items-center justify-between px-5 shrink-0 shadow-sm z-50">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2.5 text-[#f8fafc] font-black tracking-tight text-[18px]">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
              <Droplet size={18} className="text-white fill-white/20" />
            </div>
            LiquidIDE
          </div>
          <div className="w-px h-5 bg-white/10"></div>
          <div className="flex items-center gap-2 text-white/80 text-[14px]">
            <span 
              className="cursor-pointer hover:bg-white/10 px-2 py-1 rounded-md transition-colors"
              onClick={() => {
                setDialog({ type: 'rename_project', initValue: projectName });
                setDialogInput(projectName);
              }}
              title="Rename Project"
            >
              {projectName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".zip,.html"
            onChange={importFiles}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1 bg-gradient-to-r from-emerald-500/80 to-teal-500/80 hover:from-emerald-400 hover:to-teal-400 rounded-[3px] transition-all flex items-center gap-2 text-[11px] text-white border border-white/20 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer backdrop-blur-sm"
            title="Import ZIP or HTML"
          >
            Upload
          </button>
          <button
            onClick={exportHtml}
            className="px-3 py-1 bg-gradient-to-r from-purple-600/90 to-pink-600/90 hover:from-purple-500 hover:to-pink-500 rounded-[3px] transition-all flex items-center gap-2 text-[11px] text-white border border-white/20 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] cursor-pointer backdrop-blur-sm"
            title="Download HTML"
          >
            Export HTML
          </button>
          <button
            onClick={exportZip}
            className="px-3 py-1 bg-gradient-to-r from-blue-600/90 to-cyan-500/90 hover:from-blue-500 hover:to-cyan-400 rounded-[3px] transition-all flex items-center gap-2 text-[11px] text-white border border-white/20 shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] cursor-pointer backdrop-blur-sm"
          >
            Download ZIP
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-[200px] min-w-[200px] bg-black/20 border-r border-white/10 flex flex-col z-10 shrink-0 py-3 backdrop-blur-md">
          <div className="flex flex-col px-3 pb-2 gap-2">
            <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest text-center mt-1 mb-2">
              Explorer
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 w-full justify-between">
                <button
                  onClick={handleCreateFile}
                  className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded"
                  title="New File"
                >
                  <FileCode2 size={13} />
                </button>
                <button
                  onClick={handleCreateNewFolder}
                  className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded"
                  title="New Folder"
                >
                  <FolderPlus size={13} />
                </button>
                <button
                  onClick={() => fileUploadRef.current?.click()}
                  className="p-1 px-1.5 text-white bg-gradient-to-br from-pink-500/30 to-rose-500/20 hover:from-pink-500/50 hover:to-rose-500/40 border border-pink-500/30 backdrop-blur-md rounded shadow-sm transition-all flex items-center gap-1"
                  title="Upload File"
                >
                  <Upload size={13} />
                </button>
                <input
                  type="file"
                  ref={fileUploadRef}
                  className="hidden"
                  accept=".html,.css,.js,.json"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => imageUploadRef.current?.click()}
                  className="p-1 px-1.5 text-white bg-gradient-to-br from-emerald-500/30 to-teal-500/20 hover:from-emerald-500/50 hover:to-teal-500/40 border border-emerald-500/30 backdrop-blur-md rounded shadow-sm transition-all flex items-center gap-1"
                  title="Upload Image"
                >
                  <ImageIcon size={13} />
                </button>
                <button
                  onClick={collapseAllFolders}
                  className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded"
                  title="Collapse All"
                >
                  <ListCollapse size={13} />
                </button>
                <input
                  type="file"
                  ref={imageUploadRef}
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-[#007acc] transition-colors"
            />
          </div>

          <div
            className="flex-1 overflow-y-auto flex flex-col pt-1 pb-4"
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const sourceId = e.dataTransfer.getData('nodeId');
              if (sourceId) {
                setFiles((prev) =>
                  prev.map((file) =>
                    file.id === sourceId ? { ...file, parentId: null } : file
                  )
                );
              }
            }}
            onClick={() => setSelectedFolderId(null)}
          >
            {renderTree(null, 0)}
            {/* Optional: A padding div to make it easier to drop on root */}
            <div 
              className="flex-1 min-h-[50px] w-full bg-transparent" 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFolderId(null);
              }}
            />
          </div>
        </div>

        {/* Editor Area */}
        <div 
          className="flex-1 flex flex-col bg-transparent relative z-10 min-w-[200px]"
        >
          {/* Tabs */}
          <div className="flex items-center bg-black/30 h-[35px] overflow-x-auto hide-scrollbar shrink-0 backdrop-blur-md border-b border-white/5 relative">
            {openFiles.map((f) => (
              <div
                key={f.id}
                onClick={() => handleSelectFile(f.id)}
                className={cn(
                  'group flex items-center gap-2 px-4 h-full border-r border-white/5 cursor-pointer relative text-[13px] shrink-0',
                  activeFileId === f.id
                    ? 'bg-white/10 text-white border-t border-t-[#007acc]'
                    : 'hover:bg-white/5 text-white/50 border-t border-t-transparent'
                )}
              >
                <FileIcon
                  name={f.name}
                  language={f.language}
                  isFolder={f.isFolder}
                  expanded={expandedFolders.has(f.id)}
                />
                <span className="truncate flex-1">{f.name}</span>
                <button
                  onClick={(e) => handleCloseFile(e, f.id)}
                  className={cn(
                    'p-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 hover:text-white ml-2',
                    activeFileId === f.id && 'opacity-100 text-white/70'
                  )}
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            <div className="flex-1 bg-transparent h-full border-b border-transparent"></div>

            <div className="px-2 h-full flex items-center gap-1 bg-transparent pr-4">
              <button
                onClick={undoCode}
                className="p-1 px-2 text-white/50 hover:bg-white/10 hover:text-white rounded-[3px] transition-colors cursor-pointer"
                title="Undo"
              >
                <Undo size={13} />
              </button>
              <button
                onClick={redoCode}
                className="p-1 px-2 text-white/50 hover:bg-white/10 hover:text-white rounded-[3px] transition-colors cursor-pointer"
                title="Redo"
              >
                <Redo size={13} />
              </button>
              <button
                onClick={formatCode}
                className="ml-1 px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-[11px] rounded-[3px] border-none transition-colors cursor-pointer"
              >
                Format
              </button>
            </div>
          </div>

          {/* Monaco Container */}
          <div className="flex-1 w-full flex flex-col bg-transparent overflow-hidden relative">
            <div className="flex-1 w-full bg-transparent overflow-hidden relative">
              {renderEditorContent()}
            </div>

            {/* Debug Panel */}
            {showDebug && (
              <div className="h-[150px] bg-[#1e1e1e] border-t border-white/10 flex flex-col shadow-[0_-5px_15px_rgba(0,0,0,0.3)] z-20">
                <div className="h-[28px] bg-black/40 border-b border-white/5 flex items-center justify-between px-3 shrink-0">
                  <span className="text-[11px] text-white/70 uppercase">Console</span>
                  <div className="flex gap-2">
                    <button onClick={() => setLogs([])} className="text-[11px] text-white/50 hover:text-white transition-colors">Clear</button>
                    <button onClick={() => setShowDebug(false)} className="text-[11px] text-white/50 hover:text-white transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 font-mono text-[12px] flex flex-col gap-1 hide-scrollbar">
                  {logs.length === 0 ? (
                    <span className="text-white/30 italic px-2">No logs yet...</span>
                  ) : (
                    logs.map((log, i) => (
                      <div key={i} className={cn("px-2 py-0.5 rounded", log.type === 'error' ? "text-red-400 bg-red-400/10" : "text-white/80")}>
                        <span className="opacity-50 mr-2 text-[10px]">{`>`}</span>
                        {log.message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resizer Handle */}
        <div className="relative z-50 shrink-0 h-full" style={{ width: '0px' }}>
          <div className="w-px h-full bg-white/10 absolute left-0 top-0 pointer-events-none"></div>
          <div 
            onMouseDown={handlePaneResizeMouseDown}
            className={`absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-12 bg-white rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-slate-200 flex items-center justify-center cursor-ew-resize z-10 transition-transform ${isDraggingPane ? 'scale-110 shadow-[0_8px_24px_rgba(0,0,0,0.2)]' : 'hover:scale-105'}`}
          >
            <div className="flex flex-col gap-1 pointer-events-none">
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div 
          className="min-w-[300px] flex flex-col bg-[#f3f3f3] z-10 shrink-0 overflow-hidden"
          style={{ width: `${previewPaneWidthPercent}%` }}
        >
          <div className="h-[35px] border-b border-[#d4d4d4] bg-[#ffffff] flex items-center justify-center gap-5 px-3 shrink-0 relative">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={cn(
                  'px-2 py-1 rounded-[4px] text-[12px] text-[#333] transition-colors cursor-pointer',
                  deviceMode === 'desktop'
                    ? 'opacity-100 bg-[#e0e0e0]'
                    : 'opacity-50 hover:opacity-100'
                )}
                title="Desktop"
              >
                Desktop
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={cn(
                  'px-2 py-1 rounded-[4px] text-[12px] text-[#333] transition-colors cursor-pointer',
                  deviceMode === 'mobile'
                    ? 'opacity-100 bg-[#e0e0e0]'
                    : 'opacity-50 hover:opacity-100'
                )}
                title="Mobile"
              >
                Mobile
              </button>
            </div>
            <div className="absolute right-3 flex items-center gap-2">
              <button
                onClick={() => setShowDebug(!showDebug)}
                className={cn("px-2 py-1 rounded-[4px] text-[12px] transition-colors cursor-pointer border", showDebug ? "border-blue-500 text-blue-600 bg-blue-50" : "border-transparent text-[#333] opacity-60 hover:opacity-100 hover:bg-gray-100")}
              >
                Debug
              </button>
              <button
                onClick={() => setPreviewKey((k) => k + 1)}
                className="p-1 text-[#333] opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                title="Refresh"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-1 text-[#333] opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                title={isPreviewFullscreen ? "Exit Full Screen" : "Full Screen Preview"}
              >
                {isPreviewFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
              </button>
            </div>
          </div>

          <div
            ref={previewContainerRef}
            className={cn(
              "flex-1 flex overflow-hidden relative",
              isPreviewFullscreen ? "flex-col items-center bg-[#0b1326]" : `bg-[#e5e5e5] items-center justify-center ${deviceMode === 'desktop' ? 'p-0' : 'p-[40px]'}`
            )}
            style={isPreviewFullscreen ? {
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(0, 242, 255, 0.15) 0%, transparent 40%),
                radial-gradient(circle at 80% 70%, rgba(255, 36, 228, 0.15) 0%, transparent 40%)
              `
            } : undefined}
          >
            {isPreviewFullscreen && (
              <>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[rgba(255,172,232,0.1)] blur-[24px] translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-[rgba(225,253,255,0.1)] blur-[24px] -translate-x-1/2 translate-y-1/2 pointer-events-none z-0"></div>
              </>
            )}
            {!isPreviewFullscreen ? (
              <div
                className={cn(
                  'bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out relative flex flex-col',
                  deviceMode === 'desktop'
                    ? 'w-full h-full'
                    : 'w-[375px] h-[667px] max-h-[90%] max-w-[90%] rounded-lg'
                )}
              >
                {deviceMode !== 'desktop' && (
                  <div className="bg-[#f1f1f1] px-3 py-1.5 flex gap-2 items-center rounded-t-lg shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#27c93f]"></div>
                    <div className="flex-1 h-5 bg-white border border-[#ddd] rounded flex items-center px-2 text-[10px] text-[#666] ml-1">
                      localhost:3000
                    </div>
                  </div>
                )}
                <iframe
                  key={previewKey}
                  title="Preview"
                  srcDoc={generatePreviewHtml()}
                  className={cn(
                    'w-full bg-white flex-1',
                    deviceMode !== 'desktop' ? 'rounded-b-lg' : 'rounded-none'
                  )}
                  style={{ border: 'none' }}
                  sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
                />
              </div>
            ) : (
              <div className="w-full flex-1 flex flex-col items-center overflow-x-hidden font-sans pt-10">
                <div className="text-center mb-4">
                  <p className="text-slate-400 text-sm bg-slate-200/50 px-5 py-2 rounded-full inline-block shadow-sm">Drag to resize • watch the layout reflow</p>
                </div>

                {/* Breakpoint Buttons */}
                <div className="flex gap-2 mb-4 bg-slate-100/50 p-2 rounded-full backdrop-blur-sm border border-slate-200/50 shrink-0">
                  {renderBreakpointButton('MOBILE', 320, 'MOBILE', '< 480px')}
                  {renderBreakpointButton('TABLET', 480, 'TABLET', '≥ 480px')}
                  {renderBreakpointButton('LAPTOP', 768, 'LAPTOP', '≥ 768px')}
                  {renderBreakpointButton('DESKTOP', 1024, 'DESKTOP', '≥ 1024px')}
                  {renderBreakpointButton('LARGEDESKTOP', 1440, 'LARGE DESKTOP', '≥ 1440px')}
                </div>

                {/* Workspace Area */}
                <div className="w-full flex-1 overflow-x-auto overflow-y-auto px-4 pb-6 custom-scrollbar flex flex-col">
                  <div className="relative mx-auto flex-1 flex flex-col" style={{ width: '100%', maxWidth: '1440px' }}>
                    
                    {/* Ruler Track */}
                    <div className="relative h-[2px] w-full bg-slate-200 mb-6 mt-10 shrink-0">
                      {/* Colored Progress Bar */}
                      <div 
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-indigo-500 ${smoothWidthTransition}`}
                        style={{ width: `${previewWidth}px` }}
                      />

                      {/* Markers */}
                      {[0, 320, 480, 768, 1024, 1440].map((mark) => {
                        const isOverlapping = Math.abs(previewWidth - mark) < 35;
                        return (
                          <div key={mark} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center" style={{ left: `${mark}px` }}>
                            <span className={`absolute bottom-full mb-2 text-sm font-mono tracking-tight transition-all duration-300 ${isOverlapping ? 'opacity-0 scale-95' : 'text-slate-500 opacity-100 scale-100'}`}>
                              {mark}px
                            </span>
                            <div className="h-3 w-[2px] bg-slate-300" />
                          </div>
                        );
                      })}

                      {/* Current Width Pill */}
                      <div 
                        className={`absolute bottom-full mb-[0.35rem] -translate-x-1/2 z-20 ${smoothTransition}`}
                        style={{ left: `${previewWidth}px` }}
                      >
                        <div className={`${currentWidthColor} transition-colors duration-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap`}>
                          {previewWidth}px
                        </div>
                      </div>
                    </div>

                    {/* Resizable Preview Container */}
                    <div className="relative w-full flex-1 flex justify-start pb-10">
                      <div 
                        ref={resizeContainerRef}
                        className={`relative bg-white rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex flex-col ${smoothWidthTransition}`}
                        style={{ width: `${previewWidth}px` }}
                      >
                        <iframe
                          key={previewKey}
                          title="preview"
                          srcDoc={generatePreviewHtml()}
                          className="w-full bg-white flex-1"
                          style={{ border: 'none' }}
                          sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
                        />

                        {/* Drag Handle */}
                        <div 
                          onMouseDown={handleResizeMouseDown}
                          className={`absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-12 bg-white rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-slate-200 flex items-center justify-center cursor-ew-resize z-10 transition-transform ${isDraggingWidth ? 'scale-110 shadow-[0_8px_24px_rgba(0,0,0,0.2)]' : 'hover:scale-105'}`}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Close Full Screen Button Overlay */}
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-6 right-6 p-3 bg-white/80 hover:bg-white text-slate-800 rounded-full shadow-lg backdrop-blur z-50 transition-all hover:scale-110"
                >
                  <Minimize size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="h-[22px] bg-[#007acc] text-white text-[11px] flex items-center justify-between px-3 shrink-0 cursor-default select-none tracking-wide font-mono">
            <div className="flex items-center gap-4">
              <span>UTF-8</span>
              <span>HTML</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Prettier: On</span>
              <span>Git: Synchronized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
