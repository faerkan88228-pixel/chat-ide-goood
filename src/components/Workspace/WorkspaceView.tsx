/**
 * Workspace View Component
 * Agentic Full Auto Workflow Pipeline with:
 * - 'Self-Implement' persistent modification approval gate
 * - 'Auto-Refine' iterative improvement toggle button
 * - '/create_skills' illuminated glowing toggle button
 * - Live Preview & File Tree visuals right inside the workspace
 * - Recursive Pipeline Execution Trace (Analysis > Plan > Stages > Parts > Steps > Recheck)
 * Spacing: 0px side edge bounds for background, 4px UI elements and buttons.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Code2, 
  Play, 
  FolderTree, 
  Layers, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  Loader2, 
  Zap, 
  CornerDownLeft,
  ChevronRight,
  Database,
  Terminal,
  Cpu,
  Monitor,
  Wand2,
  Check,
  X,
  ShieldAlert,
  Network,
  Search
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { 
  ChatMessage, 
  VirtualFile, 
  PipelineExecution, 
  CodeLanguage,
  AutoRefineProposal,
  AppModificationProposal 
} from '@/types';
import { RecursivePipelineView } from './RecursivePipelineView';
import { FileTreeExplorer } from './FileTreeExplorer';
import { LivePreviewSandbox } from './LivePreviewSandbox';
import { PipelineDependencyGraph } from './PipelineDependencyGraph';
import { cn } from '@/lib/utils';

interface WorkspaceViewProps {
  history: ChatMessage[];
  onSendMessage: (msg: string) => void;
  isProcessing: boolean;
  currentPipeline?: PipelineExecution;
  isSelfImplement: boolean;
  isSkillCreationMode: boolean;
  setIsSkillCreationMode: (val: boolean) => void;
  isAutoRefine: boolean;
  setIsAutoRefine: (val: boolean) => void;
  files: VirtualFile[];
  activeFile?: VirtualFile;
  onSelectFile: (path: string) => void;
  onSaveFile: (path: string, newContent: string) => void;
  onCreateFile: (path: string, content: string, language: CodeLanguage) => void;
  onDeleteFile: (path: string) => void;
  onOpenSkillsDrawer: () => void;
  onApproveModification: (proposal: AppModificationProposal) => void;
  onRejectModification: (proposal: AppModificationProposal) => void;
  onApplyRefinedCode: (proposal: AutoRefineProposal) => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  history,
  onSendMessage,
  isProcessing,
  currentPipeline,
  isSelfImplement,
  isSkillCreationMode,
  setIsSkillCreationMode,
  isAutoRefine,
  setIsAutoRefine,
  files,
  activeFile,
  onSelectFile,
  onSaveFile,
  onCreateFile,
  onDeleteFile,
  onOpenSkillsDrawer,
  onApproveModification,
  onRejectModification,
  onApplyRefinedCode
}) => {
  const [input, setInput] = useState('');
  const [rightPanelTab, setRightPanelTab] = useState<'preview' | 'files' | 'pipeline'>('preview');
  const [mobileTab, setMobileTab] = useState<'chat' | 'workspace'>('chat');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isProcessing, currentPipeline]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const presetQueries = [
    { label: '⚡ React Luxury UI', prompt: 'Создай люксовый виджет телеметрии с анимацией Framer Motion и темной темой на React 19' },
    { label: '🛡️ TLDRSec Defense', prompt: 'Проведи аудит безопасности, напиши санитизатор промптов и проверь на инъекции' },
    { label: '🐍 Python Stream Engine', prompt: 'Напиши Python скрипт для анализа статистического потока данных с оценкой доверия > 90%' },
    { label: '🦀 Rust Memory Worker', prompt: 'Создай модуль на Rust для системного контроля буфера без аллокаций памяти' }
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-zinc-950 px-0 py-1 gap-1">
      
      {/* Mobile Tab Switcher (Visible only on small screens) */}
      <div className="flex lg:hidden items-center p-1 rounded-lg bg-zinc-900 border border-white/10 shrink-0 mx-1">
        <button
          onClick={() => setMobileTab('chat')}
          className={cn(
            "flex-1 py-1.5 rounded-md text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5",
            mobileTab === 'chat' ? "bg-emerald-500 text-zinc-950 shadow-md" : "text-zinc-400"
          )}
        >
          <Bot size={13} />
          <span>Чат и Конвейер</span>
        </button>
        <button
          onClick={() => setMobileTab('workspace')}
          className={cn(
            "flex-1 py-1.5 rounded-md text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5",
            mobileTab === 'workspace' ? "bg-emerald-500 text-zinc-950 shadow-md" : "text-zinc-400"
          )}
        >
          <Monitor size={13} />
          <span>Превью и Файлы ({files.length})</span>
        </button>
      </div>

      {/* Main Split Screen */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 gap-1 px-1">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: CHAT, PIPELINE TRACE, AUTO-REFINE & /create_skills BUTTON   */}
        {/* ========================================================================= */}
        <div className={cn(
          "flex-1 flex flex-col min-h-0 rounded-xl bg-zinc-900/90 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden",
          mobileTab === 'workspace' && "hidden lg:flex"
        )}>
          
          {/* Chat Header */}
          <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between gap-2 bg-zinc-950/70 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
                <Bot size={14} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white tracking-tight uppercase font-mono">Agentic Pipeline</h2>
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-400">
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isProcessing ? "bg-amber-400 animate-ping" : "bg-emerald-400"
                  )}></span>
                  <span>{isProcessing ? "Исполнение конвейера..." : "Оркестратор в сети"}</span>
                </div>
              </div>
            </div>

            {/* Top Status Indicators */}
            <div className="flex items-center gap-1.5">
              {isSelfImplement && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[9px] font-bold">
                  <Zap size={9} className="text-amber-400" />
                  Self-Implement
                </span>
              )}
              {isAutoRefine && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[9px] font-bold">
                  <Wand2 size={9} className="text-cyan-400" />
                  Auto-Refine
                </span>
              )}
            </div>
          </div>

          {/* Chat Messages Stream Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3" ref={scrollRef}>
            
            {/* Welcome / Quick Prompts when empty */}
            {history.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-3 max-w-lg mx-auto space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                  <Sparkles size={24} />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white tracking-tight font-['Syne',sans-serif]">
                    Nexus Автономный Воркспейс
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Введите задачу. Конвейер выполнит 6-этапную декомпозицию, синтезирует полиглот-код, предложит Auto-Refine оптимизации и запросит одобрение на запись при Self-Implement.
                  </p>
                </div>

                {/* Preset Chips with 4px spacing */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                  {presetQueries.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(p.prompt)}
                      className="p-2.5 rounded-lg bg-zinc-950/80 hover:bg-zinc-900 border border-white/5 hover:border-emerald-500/30 text-left transition-all group"
                    >
                      <span className="text-[10px] font-bold text-zinc-200 group-hover:text-emerald-400 block mb-0.5 font-mono">
                        {p.label}
                      </span>
                      <span className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {p.prompt}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat History Render */}
            {history.map((msg) => (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id}
                className={cn(
                  "flex gap-2 max-w-full",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                {/* Avatar Icon */}
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-0.5",
                  msg.role === 'user' 
                    ? "bg-zinc-100 text-zinc-950 font-bold text-xs font-mono" 
                    : "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                )}>
                  {msg.role === 'user' ? <User size={13} /> : <Bot size={14} />}
                </div>

                {/* Message Bubble Body */}
                <div className={cn(
                  "rounded-xl p-3 text-xs leading-relaxed max-w-[92%] sm:max-w-[88%] space-y-2",
                  msg.role === 'user'
                    ? "bg-emerald-500 text-zinc-950 font-semibold rounded-tr-none shadow-md"
                    : "bg-zinc-950/90 text-zinc-200 border border-white/10 rounded-tl-none shadow-xl"
                )}>
                  
                  {/* Skill Creation Badge if active */}
                  {msg.isSkillCreationMode && msg.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[9px] font-semibold">
                      <Sparkles size={10} className="text-purple-400" />
                      <span>RAG Навык автоматически векторизован и сохранен</span>
                    </div>
                  )}

                  {/* Auto-Refine Badge if active */}
                  {msg.isAutoRefineActive && msg.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[9px] font-semibold">
                      <Wand2 size={10} className="text-cyan-400" />
                      <span>Применен цикл итеративной оптимизации Auto-Refine</span>
                    </div>
                  )}

                  {/* Markdown Content */}
                  <div className="prose prose-invert prose-xs max-w-none text-xs leading-relaxed">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>

                  {/* Attached Pipeline Visual Trace */}
                  {msg.pipeline && (
                    <div className="pt-1">
                      <RecursivePipelineView 
                        pipeline={msg.pipeline} 
                        onSelectCodeSnippet={(fn, cd) => {
                          onSelectFile(fn);
                          setRightPanelTab('files');
                        }}
                        onApproveModification={onApproveModification}
                        onRejectModification={onRejectModification}
                        onApplyRefinedCode={onApplyRefinedCode}
                        onOpenGraphView={() => {
                          setRightPanelTab('pipeline');
                          setMobileTab('workspace');
                        }}
                      />
                    </div>
                  )}

                  {/* Footer Timings */}
                  {msg.latencyMs !== undefined && (
                    <div className="pt-0.5 flex items-center justify-between text-[9px] font-mono text-zinc-500">
                      <span>Время: {msg.latencyMs}ms</span>
                      {msg.pipeline?.overallConfidence && (
                        <span className="text-emerald-400 font-bold">
                          Conf: {msg.pipeline.overallConfidence}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Real-time Streaming Pipeline Indicator */}
            {isProcessing && currentPipeline && (
              <div className="py-1">
                <RecursivePipelineView 
                  pipeline={currentPipeline}
                  onSelectCodeSnippet={(fn) => {
                    onSelectFile(fn);
                    setRightPanelTab('files');
                  }}
                  onApproveModification={onApproveModification}
                  onRejectModification={onRejectModification}
                  onApplyRefinedCode={onApplyRefinedCode}
                  onOpenGraphView={() => {
                    setRightPanelTab('pipeline');
                    setMobileTab('workspace');
                  }}
                />
              </div>
            )}

          </div>

          {/* Chat Input Bar with /create_skills & Auto-Refine toggle buttons */}
          <div className="p-2 border-t border-white/10 bg-zinc-950/95 shrink-0 space-y-1.5">
            
            {/* Quick Action Toolbar with 4px element spacing */}
            <div className="flex flex-wrap items-center justify-between gap-1 px-0.5">
              
              <div className="flex items-center gap-1">
                
                {/* 1. THE /create_skills CHAT BUTTON (Lights up when ON, lights off when OFF) */}
                <button
                  id="btn-create-skills-toggle"
                  type="button"
                  onClick={() => setIsSkillCreationMode(!isSkillCreationMode)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all duration-200 select-none border",
                    isSkillCreationMode
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-[0_0_14px_rgba(168,85,247,0.55)] scale-102"
                      : "bg-zinc-900 border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20"
                  )}
                  title="Режим /create_skills: автоматическое пополнение постоянной базы RAG навыков из диалога"
                >
                  <Sparkles 
                    size={13} 
                    className={cn(
                      "transition-transform",
                      isSkillCreationMode ? "text-amber-300 animate-spin" : "text-zinc-500"
                    )} 
                  />
                  <span className="font-mono text-[11px]">/create_skills</span>
                  <span className={cn(
                    "px-1 py-0.2 rounded text-[8px] uppercase font-mono font-bold",
                    isSkillCreationMode ? "bg-white text-purple-950" : "bg-zinc-800 text-zinc-500"
                  )}>
                    {isSkillCreationMode ? "ON" : "OFF"}
                  </span>
                </button>

                {/* 2. THE 'Auto-Refine' TOGGLE BUTTON (Lights up when ON, lights off when OFF) */}
                <button
                  id="btn-auto-refine-toggle"
                  type="button"
                  onClick={() => setIsAutoRefine(!isAutoRefine)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all duration-200 select-none border",
                    isAutoRefine
                      ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.55)] scale-102"
                      : "bg-zinc-900 border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20"
                  )}
                  title="Auto-Refine: агент формирует итеративные улучшения и диффы кода перед финальной фиксацией"
                >
                  <Wand2 
                    size={13} 
                    className={cn(
                      "transition-transform",
                      isAutoRefine ? "text-cyan-200 animate-pulse" : "text-zinc-500"
                    )} 
                  />
                  <span className="font-mono text-[11px]">Auto-Refine</span>
                  <span className={cn(
                    "px-1 py-0.2 rounded text-[8px] uppercase font-mono font-bold",
                    isAutoRefine ? "bg-white text-cyan-950" : "bg-zinc-800 text-zinc-500"
                  )}>
                    {isAutoRefine ? "ON" : "OFF"}
                  </span>
                </button>

              </div>

              {/* Status Hint */}
              <div className="text-[10px] text-zinc-500 font-mono hidden md:block">
                {isAutoRefine 
                  ? "⚡ Итеративная оптимизация кода активна" 
                  : isSkillCreationMode 
                    ? "✨ RAG экстракция активна" 
                    : "Enter для отправки"}
              </div>

            </div>

            {/* Input Form with 4px padding/margins */}
            <form onSubmit={handleSubmit} className="flex items-end gap-1.5 bg-zinc-900/90 p-1.5 rounded-lg border border-white/10 focus-within:border-emerald-500/50 transition-all shadow-inner">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isAutoRefine 
                    ? "Введите задачу с авто-улучшением (Auto-Refine оптимизирует код перед фиксацией)..." 
                    : isSkillCreationMode 
                      ? "Опишите навык для RAG базы (например: 'Фильтрация таблиц с поиском')..." 
                      : "Введите задачу для оркестратора (например: 'Создай модуль телеметрии на React')..."
                }
                rows={2}
                disabled={isProcessing}
                className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-500 outline-none resize-none px-1.5 py-1 leading-relaxed"
              />

              <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className={cn(
                  "p-2 rounded-md font-bold transition-all shrink-0 flex items-center justify-center",
                  input.trim() && !isProcessing
                    ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_12px_rgba(16,185,129,0.4)] active:scale-95"
                    : "bg-white/5 text-zinc-600 cursor-not-allowed"
                )}
              >
                {isProcessing ? <Loader2 size={15} className="animate-spin text-zinc-400" /> : <Send size={15} />}
              </button>
            </form>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: MULTI-LANGUAGE LIVE PREVIEW & FILE TREE VISUALS            */}
        {/* ========================================================================= */}
        <div className={cn(
          "flex-1 flex flex-col min-h-0 rounded-xl bg-zinc-900/90 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden",
          mobileTab === 'chat' && "hidden lg:flex"
        )}>
          
          {/* Right Panel Tabs Header */}
          <div className="p-1.5 border-b border-white/10 flex items-center justify-between gap-2 bg-zinc-950/70 shrink-0">
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900 border border-white/10">
              
              <button
                id="tab-btn-preview"
                onClick={() => setRightPanelTab('preview')}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all",
                  rightPanelTab === 'preview'
                    ? "bg-emerald-500 text-zinc-950 shadow-sm"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                <Play size={12} fill="currentColor" />
                <span>Live Preview</span>
              </button>

              <button
                id="tab-btn-files"
                onClick={() => setRightPanelTab('files')}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all",
                  rightPanelTab === 'files'
                    ? "bg-emerald-500 text-zinc-950 shadow-sm"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                <FolderTree size={12} />
                <span>Файловое Дерево</span>
                <span className="px-1 py-0.2 rounded bg-black/40 font-mono text-[9px]">
                  {files.length}
                </span>
              </button>

              <button
                id="tab-btn-graph"
                onClick={() => setRightPanelTab('pipeline')}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all",
                  rightPanelTab === 'pipeline'
                    ? "bg-emerald-500 text-zinc-950 shadow-sm"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                <Network size={12} className={cn(isProcessing ? "text-cyan-400 animate-pulse" : "")} />
                <span>D3 Граф Зависимостей</span>
                {isProcessing && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                )}
              </button>

            </div>

            {/* Active File / Search Shortcut Indicator */}
            <div className="flex items-center gap-2 pr-2">
              <button
                onClick={() => {
                  setRightPanelTab('files');
                  setTimeout(() => {
                    document.getElementById('global-workspace-file-search')?.focus();
                  }, 50);
                }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-zinc-300 hover:text-white transition-all shadow-sm"
                title="Глобальный поиск файлов и кода (Ctrl+F / Cmd+K)"
              >
                <Search size={11} className="text-emerald-400" />
                <span className="hidden sm:inline">Поиск</span>
                <kbd className="hidden md:inline-block px-1 py-0.2 rounded text-[8px] bg-zinc-800 text-zinc-400 border border-white/10">⌘K</kbd>
              </button>

              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 pl-1 border-l border-white/10">
                {rightPanelTab === 'pipeline' ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> D3 Topology DAG
                  </span>
                ) : (
                  <>Файл: <b className="text-emerald-400">{activeFile?.name || 'App.tsx'}</b></>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel Content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {rightPanelTab === 'preview' && (
              <LivePreviewSandbox files={files} activeFile={activeFile} />
            )}

            {rightPanelTab === 'files' && (
              <FileTreeExplorer
                files={files}
                activeFile={activeFile}
                onSelectFile={onSelectFile}
                onSaveFile={onSaveFile}
                onCreateFile={onCreateFile}
                onDeleteFile={onDeleteFile}
              />
            )}

            {rightPanelTab === 'pipeline' && (
              <PipelineDependencyGraph
                pipeline={currentPipeline || history.slice().reverse().find(m => m.pipeline)?.pipeline}
                isProcessing={isProcessing}
                onSelectCodeSnippet={(fn) => {
                  onSelectFile(fn);
                  setRightPanelTab('files');
                }}
                onApproveModification={onApproveModification}
                onRejectModification={onRejectModification}
              />
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
