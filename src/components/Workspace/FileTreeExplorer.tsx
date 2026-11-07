/**
 * Multi-Language File Tree Explorer & In-Workspace Code Editor
 * With Global Search (Filename & Content String), Match Highlighting & Jump-to-Line.
 * Supports TypeScript/React, Python, Rust, HTML, CSS, SQL, Markdown.
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  FolderTree, 
  FileCode, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  Copy, 
  FileText,
  Search,
  X,
  FileSearch,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Hash,
  Sparkles
} from 'lucide-react';
import { VirtualFile, CodeLanguage } from '@/types';
import { cn } from '@/lib/utils';

interface FileTreeExplorerProps {
  files: VirtualFile[];
  activeFile?: VirtualFile;
  onSelectFile: (path: string) => void;
  onSaveFile: (path: string, newContent: string) => void;
  onCreateFile: (path: string, content: string, language: CodeLanguage) => void;
  onDeleteFile: (path: string) => void;
  initialSearchQuery?: string;
}

interface ContentMatch {
  lineNumber: number;
  lineText: string;
  charIndex: number;
}

interface FileSearchResult {
  file: VirtualFile;
  matchesName: boolean;
  contentMatches: ContentMatch[];
  totalMatches: number;
}

export const FileTreeExplorer: React.FC<FileTreeExplorerProps> = ({
  files,
  activeFile,
  onSelectFile,
  onSaveFile,
  onCreateFile,
  onDeleteFile,
  initialSearchQuery = ''
}) => {
  const [editorContent, setEditorContent] = useState<string>(activeFile?.content || '');
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState(false);
  const [newFilePath, setNewFilePath] = useState('/src/');
  const [newFileLang, setNewFileLang] = useState<CodeLanguage>('typescript');
  const [copied, setCopied] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [searchScope, setSearchScope] = useState<'all' | 'name' | 'content'>('all');
  const [isCaseSensitive, setIsCaseSensitive] = useState<boolean>(false);
  const [expandedFileMatches, setExpandedFileMatches] = useState<Record<string, boolean>>({});
  const [activeMatchIndex, setActiveMatchIndex] = useState<number>(0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const editorTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync editor content when active file changes
  useEffect(() => {
    if (activeFile) {
      setEditorContent(activeFile.content);
      setActiveMatchIndex(0);
    }
  }, [activeFile?.path, activeFile?.content]);

  // Global Keyboard Shortcut: Ctrl+F or Cmd+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        if (searchQuery) {
          setSearchQuery('');
        } else {
          searchInputRef.current?.blur();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  // Global Search Engine across filenames & contents
  const searchResults: FileSearchResult[] = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) {
      return files.map(file => ({
        file,
        matchesName: false,
        contentMatches: [],
        totalMatches: 0
      }));
    }

    const compareQuery = isCaseSensitive ? query : query.toLowerCase();

    return files.map(file => {
      const fileNameCompare = isCaseSensitive ? file.name : file.name.toLowerCase();
      const filePathCompare = isCaseSensitive ? file.path : file.path.toLowerCase();
      const matchesName = fileNameCompare.includes(compareQuery) || filePathCompare.includes(compareQuery);

      const contentMatches: ContentMatch[] = [];
      const lines = file.content.split('\n');

      lines.forEach((line, idx) => {
        const lineCompare = isCaseSensitive ? line : line.toLowerCase();
        const foundPos = lineCompare.indexOf(compareQuery);
        if (foundPos !== -1) {
          contentMatches.push({
            lineNumber: idx + 1,
            lineText: line.trim(),
            charIndex: foundPos
          });
        }
      });

      const totalMatches = (matchesName ? 1 : 0) + contentMatches.length;

      return {
        file,
        matchesName,
        contentMatches,
        totalMatches
      };
    });
  }, [files, searchQuery, isCaseSensitive]);

  // Filtered files according to search scope
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return searchResults;

    return searchResults.filter(res => {
      if (searchScope === 'all') {
        return res.matchesName || res.contentMatches.length > 0;
      }
      if (searchScope === 'name') {
        return res.matchesName;
      }
      if (searchScope === 'content') {
        return res.contentMatches.length > 0;
      }
      return true;
    });
  }, [searchResults, searchQuery, searchScope]);

  // Total matches across the whole workspace
  const totalStats = useMemo(() => {
    const totalFilesMatched = filteredFiles.filter(r => r.totalMatches > 0).length;
    const totalContentMatches = filteredFiles.reduce((acc, r) => acc + r.contentMatches.length, 0);
    return { totalFilesMatched, totalContentMatches };
  }, [filteredFiles]);

  // Active file's matching lines in content
  const activeFileMatches = useMemo(() => {
    if (!activeFile || !searchQuery.trim()) return [];
    const found = searchResults.find(r => r.file.path === activeFile.path);
    return found ? found.contentMatches : [];
  }, [activeFile, searchResults, searchQuery]);

  const handleSave = () => {
    if (activeFile) {
      onSaveFile(activeFile.path, editorContent);
      setSavedBadge(true);
      setTimeout(() => setSavedBadge(false), 1500);
    }
  };

  const handleCopy = () => {
    if (editorContent) {
      navigator.clipboard.writeText(editorContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilePath.trim()) return;
    onCreateFile(newFilePath.trim(), '// Новый файл Nexus Workspace\n', newFileLang);
    setIsNewFileModalOpen(false);
    setNewFilePath('/src/');
  };

  // Jump to specific line in code editor
  const jumpToLine = (lineNumber: number) => {
    if (!editorTextareaRef.current) return;
    const lines = editorContent.split('\n');
    let charOffset = 0;
    for (let i = 0; i < lineNumber - 1 && i < lines.length; i++) {
      charOffset += lines[i].length + 1;
    }
    const targetLineLength = lines[lineNumber - 1] ? lines[lineNumber - 1].length : 0;
    
    editorTextareaRef.current.focus();
    editorTextareaRef.current.setSelectionRange(charOffset, charOffset + targetLineLength);

    // Approximate scroll calculation
    const lineHeight = 20;
    editorTextareaRef.current.scrollTop = Math.max(0, (lineNumber - 4) * lineHeight);
  };

  // Cycle through matches in active file
  const handleNextMatch = () => {
    if (activeFileMatches.length === 0) return;
    const nextIdx = (activeMatchIndex + 1) % activeFileMatches.length;
    setActiveMatchIndex(nextIdx);
    jumpToLine(activeFileMatches[nextIdx].lineNumber);
  };

  const handlePrevMatch = () => {
    if (activeFileMatches.length === 0) return;
    const prevIdx = (activeMatchIndex - 1 + activeFileMatches.length) % activeFileMatches.length;
    setActiveMatchIndex(prevIdx);
    jumpToLine(activeFileMatches[prevIdx].lineNumber);
  };

  const toggleFileExpansion = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFileMatches(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const getLanguageBadge = (lang: CodeLanguage) => {
    switch (lang) {
      case 'typescript':
      case 'javascript':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">TS</span>;
      case 'python':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">PY</span>;
      case 'rust':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">RS</span>;
      case 'html':
      case 'css':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">HTML</span>;
      case 'sql':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">SQL</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-zinc-700 text-zinc-300">DOC</span>;
    }
  };

  // Highlight query substring in text
  const renderHighlightedText = (text: string, query: string) => {
    if (!query) return text;
    const flags = isCaseSensitive ? 'g' : 'gi';
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, flags));
    return (
      <span>
        {parts.map((part, i) => 
          (isCaseSensitive ? part === query : part.toLowerCase() === query.toLowerCase()) ? (
            <mark key={i} className="bg-emerald-400 text-zinc-950 font-bold px-0.5 rounded-sm">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full rounded-2xl md:rounded-3xl bg-zinc-900/85 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
      
      {/* Top Header Bar */}
      <div className="p-3 sm:p-4 border-b border-white/10 flex items-center justify-between gap-3 bg-zinc-950/70 shrink-0">
        <div className="flex items-center gap-2">
          <FolderTree size={16} className="text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Файловая Система</span>
          <span className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-400 text-[10px] font-mono">
            {files.length} {files.length === 1 ? 'файл' : 'файлов'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewFileModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 text-xs font-semibold transition-all shadow-sm active:scale-95"
            title="Создать новый файл"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">Новый Файл</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          GLOBAL SEARCH INPUT BAR (NAME & CONTENT FILTER)
          ======================================================== */}
      <div className="p-2.5 sm:p-3 border-b border-white/10 bg-zinc-950/90 shrink-0 space-y-2">
        <div className="relative flex items-center">
          <Search size={14} className={cn(
            "absolute left-3 transition-colors",
            searchQuery ? "text-emerald-400" : "text-zinc-500"
          )} />
          
          <input
            ref={searchInputRef}
            id="global-workspace-file-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по имени файла или содержимому кода (Ctrl+F / Cmd+K)..."
            className="w-full pl-9 pr-24 py-2 rounded-xl bg-zinc-900/90 border border-white/10 focus:border-emerald-500/60 font-mono text-xs text-white placeholder:text-zinc-500 outline-none transition-all shadow-inner focus:ring-1 focus:ring-emerald-500/30"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Очистить поиск (Esc)"
              >
                <X size={13} />
              </button>
            )}
            <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-zinc-800/80 text-zinc-400 border border-white/10 select-none">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Search Scope Filters and Metrics */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-1 bg-zinc-900/60 p-0.5 rounded-lg border border-white/5">
            <button
              onClick={() => setSearchScope('all')}
              className={cn(
                "px-2 py-0.5 rounded-md font-mono transition-all",
                searchScope === 'all'
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Везде
            </button>
            <button
              onClick={() => setSearchScope('name')}
              className={cn(
                "px-2 py-0.5 rounded-md font-mono transition-all",
                searchScope === 'name'
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              По имени
            </button>
            <button
              onClick={() => setSearchScope('content')}
              className={cn(
                "px-2 py-0.5 rounded-md font-mono transition-all",
                searchScope === 'content'
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              В коде
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCaseSensitive(!isCaseSensitive)}
              className={cn(
                "px-2 py-0.5 rounded-md font-mono text-[10px] border transition-all",
                isCaseSensitive
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                  : "bg-transparent text-zinc-500 border-white/5 hover:text-zinc-300"
              )}
              title="Учитывать регистр (Case Sensitive)"
            >
              Aa
            </button>

            {/* Results Counter */}
            {searchQuery.trim() ? (
              <span className="text-zinc-400 font-mono text-[10px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Найдено: <b className="text-emerald-400">{filteredFiles.length}</b> {filteredFiles.length === 1 ? 'файл' : 'файлов'}</span>
                {totalStats.totalContentMatches > 0 && (
                  <span className="text-zinc-500">({totalStats.totalContentMatches} совп. в коде)</span>
                )}
              </span>
            ) : (
              <span className="text-zinc-500 font-mono text-[10px]">
                Показаны все {files.length} файлов
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Split: Left File Tabs / Right Code Area */}
      <div className="flex flex-col sm:flex-row flex-1 min-h-0 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
        
        {/* Left: Files List & Match Previews */}
        <div className="w-full sm:w-64 md:w-72 shrink-0 bg-zinc-950/50 p-2 overflow-y-auto max-h-52 sm:max-h-none space-y-1.5">
          {filteredFiles.length === 0 ? (
            <div className="p-6 text-center space-y-3">
              <FileSearch size={28} className="mx-auto text-zinc-600" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-zinc-300">Ничего не найдено</p>
                <p className="text-[11px] text-zinc-500">
                  По запросу «<span className="text-zinc-300 font-mono">{searchQuery}</span>» совпадений не обнаружено
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 transition-all"
              >
                Сбросить поиск
              </button>
            </div>
          ) : (
            filteredFiles.map((res) => {
              const f = res.file;
              const isSelected = activeFile?.path === f.path;
              const hasContentMatches = res.contentMatches.length > 0;
              const isExpanded = expandedFileMatches[f.path] !== false; // default open when matches exist

              return (
                <div key={f.path} className="space-y-1">
                  <div
                    onClick={() => onSelectFile(f.path)}
                    className={cn(
                      "flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs cursor-pointer transition-all select-none group border",
                      isSelected 
                        ? "bg-emerald-500/15 text-emerald-300 font-semibold border-emerald-500/40 shadow-sm" 
                        : "border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {getLanguageBadge(f.language)}
                      <span className="truncate font-mono text-[11px]">
                        {searchQuery ? renderHighlightedText(f.name, searchQuery) : f.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Match Badges */}
                      {res.matchesName && searchQuery && (
                        <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          Имя
                        </span>
                      )}

                      {hasContentMatches && searchQuery && (
                        <button
                          onClick={(e) => toggleFileExpansion(f.path, e)}
                          className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors flex items-center gap-0.5"
                          title="Показать / скрыть строки с совпадениями"
                        >
                          <span>{res.contentMatches.length}</span>
                        </button>
                      )}

                      {files.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteFile(f.path);
                          }}
                          className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-1 transition-opacity"
                          title="Удалить файл"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Content Matches Snippets Preview under File */}
                  {hasContentMatches && searchQuery && isExpanded && (
                    <div className="ml-3 pl-2 border-l border-emerald-500/30 space-y-1 my-1">
                      {res.contentMatches.slice(0, 5).map((match, mIdx) => (
                        <div
                          key={mIdx}
                          onClick={() => {
                            onSelectFile(f.path);
                            setTimeout(() => jumpToLine(match.lineNumber), 50);
                          }}
                          className="px-2 py-1 rounded-md bg-zinc-900/80 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-[10px] font-mono cursor-pointer transition-colors group/item flex items-start gap-1.5"
                        >
                          <span className="text-emerald-400/80 shrink-0 font-bold">
                            L{match.lineNumber}:
                          </span>
                          <span className="truncate text-zinc-400 group-hover/item:text-zinc-200">
                            {renderHighlightedText(match.lineText, searchQuery)}
                          </span>
                        </div>
                      ))}

                      {res.contentMatches.length > 5 && (
                        <div 
                          onClick={() => onSelectFile(f.path)}
                          className="text-[9px] text-zinc-500 font-mono hover:text-emerald-400 cursor-pointer pl-1"
                        >
                          + ещё {res.contentMatches.length - 5} совпадений в файле
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right: Code Editor & Actions */}
        <div className="flex-1 flex flex-col min-w-0 bg-zinc-950/80">
          
          {/* Active File Header */}
          <div className="px-3 sm:px-4 py-2 border-b border-white/5 flex items-center justify-between gap-2 bg-zinc-950/40 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <FileCode size={14} className="text-emerald-400 shrink-0" />
              <span className="text-xs font-mono text-zinc-300 truncate font-semibold">
                {activeFile?.path || '/src/App.tsx'}
              </span>
              {activeFile && getLanguageBadge(activeFile.language)}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                title="Копировать код"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-md active:scale-95"
              >
                <Save size={13} />
                <span>{savedBadge ? "Сохранено!" : "Сохранить"}</span>
              </button>
            </div>
          </div>

          {/* Matches Navigation Strip inside Active File */}
          {searchQuery && activeFileMatches.length > 0 && (
            <div className="px-4 py-1.5 bg-emerald-950/40 border-b border-emerald-500/20 flex items-center justify-between text-xs font-mono shrink-0">
              <div className="flex items-center gap-2 text-emerald-300">
                <Sparkles size={12} className="text-emerald-400" />
                <span>
                  В файле: <b className="text-white">{activeFileMatches.length}</b> {activeFileMatches.length === 1 ? 'совпадение' : 'совпадений'}
                  {activeFileMatches.length > 0 && ` (${activeMatchIndex + 1} из ${activeFileMatches.length})`}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMatch}
                  className="p-1 rounded hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                  title="Предыдущее совпадение"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={handleNextMatch}
                  className="p-1 rounded hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                  title="Следующее совпадение"
                >
                  <ArrowDown size={12} />
                </button>
              </div>
            </div>
          )}

          {/* Interactive Code Editor Area with Line Numbers */}
          <div className="flex-1 relative overflow-hidden flex font-mono text-xs">
            {/* Line Numbers Gutter */}
            <div className="w-12 bg-zinc-950/80 py-4 select-none text-right pr-3 text-zinc-600 border-r border-white/5 space-y-0 leading-relaxed overflow-hidden hidden sm:block">
              {editorContent.split('\n').map((_, index) => {
                const lineNum = index + 1;
                const isMatchLine = activeFileMatches.some(m => m.lineNumber === lineNum);
                return (
                  <div
                    key={lineNum}
                    onClick={() => jumpToLine(lineNum)}
                    className={cn(
                      "cursor-pointer transition-colors text-[11px]",
                      isMatchLine 
                        ? "text-emerald-400 font-bold bg-emerald-500/10 rounded-sm" 
                        : "hover:text-zinc-400"
                    )}
                    title={isMatchLine ? `Совпадение на строке ${lineNum}` : undefined}
                  >
                    {lineNum}
                  </div>
                );
              })}
            </div>

            {/* Textarea Editor */}
            <textarea
              ref={editorTextareaRef}
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              placeholder="// Исходный код файла..."
              spellCheck={false}
              className="flex-1 h-full p-4 bg-transparent text-zinc-200 resize-none outline-none leading-relaxed selection:bg-emerald-500/30 overflow-y-auto"
            />
          </div>

        </div>

      </div>

      {/* Modal for Creating New File */}
      {isNewFileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-zinc-900 border border-white/15 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Создать Новый Файл</h3>
            <form onSubmit={handleCreateNew} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Путь к файлу</label>
                <input
                  type="text"
                  value={newFilePath}
                  onChange={(e) => setNewFilePath(e.target.value)}
                  placeholder="/src/components/MyComponent.tsx"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 font-mono text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Язык</label>
                <select
                  value={newFileLang}
                  onChange={(e) => setNewFileLang(e.target.value as CodeLanguage)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white outline-none focus:border-emerald-500"
                >
                  <option value="typescript">TypeScript (.ts/.tsx)</option>
                  <option value="python">Python (.py)</option>
                  <option value="rust">Rust (.rs)</option>
                  <option value="html">HTML (.html)</option>
                  <option value="css">CSS (.css)</option>
                  <option value="sql">SQL (.sql)</option>
                  <option value="markdown">Markdown (.md)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewFileModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-300 font-semibold"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
