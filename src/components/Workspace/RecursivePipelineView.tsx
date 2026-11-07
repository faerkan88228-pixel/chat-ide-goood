/**
 * Recursive Pipeline Trace Component
 * Analysis > План > Этапы > Части > Шаги > Перепроверка
 * Displays real-time confidence scores (>90%), Auto-Refine proposals, and Self-Implement Approval Gate.
 * Strict spacing: 0px side edge bounds, 4px UI spacing rhythm.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Code2, 
  Activity, 
  ChevronDown, 
  ChevronUp,
  FileCode,
  Sparkles,
  Terminal,
  Cpu,
  Layers,
  Wand2,
  Check,
  X,
  ArrowRight,
  ShieldAlert,
  Network
} from 'lucide-react';
import { PipelineExecution, PipelineStep, AutoRefineProposal, AppModificationProposal } from '@/types';
import { cn } from '@/lib/utils';

export const RecursivePipelineView: React.FC<{
  pipeline?: PipelineExecution;
  onSelectCodeSnippet?: (filename: string, code: string) => void;
  onApproveModification?: (proposal: AppModificationProposal) => void;
  onRejectModification?: (proposal: AppModificationProposal) => void;
  onApplyRefinedCode?: (proposal: AutoRefineProposal) => void;
  onOpenGraphView?: () => void;
}> = ({ 
  pipeline, 
  onSelectCodeSnippet,
  onApproveModification,
  onRejectModification,
  onApplyRefinedCode,
  onOpenGraphView
}) => {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [showDiffView, setShowDiffView] = useState<boolean>(false);

  if (!pipeline || pipeline.steps.length === 0) {
    return (
      <div className="w-full p-4 rounded-xl bg-zinc-900/60 border border-white/5 text-center">
        <div className="w-10 h-10 rounded-lg bg-zinc-800/80 border border-white/5 mx-auto flex items-center justify-center text-zinc-500 mb-2">
          <Layers size={20} />
        </div>
        <h4 className="text-sm font-semibold text-zinc-300">Очередь Рекурсивного Конвейера</h4>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
          Отправьте запрос для запуска 6-этапного цикла с контролем доверия &gt; 90% и возможностью Auto-Refine.
        </p>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedStepId(prev => prev === id ? null : id);
  };

  return (
    <div className="w-full p-3 rounded-xl bg-zinc-900/90 border border-white/10 shadow-2xl backdrop-blur-xl space-y-3">
      
      {/* Top Banner with Execution Overview & Confidence Gauge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
            <Cpu size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-white tracking-tight">Рекурсивный Конвейер</h3>
              <span className={cn(
                "text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border",
                pipeline.isComplete
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
              )}>
                {pipeline.isComplete ? "УТВЕРЖДЕНО" : "ИСПОЛНЕНИЕ..."}
              </span>
              {pipeline.autoRefineActive && (
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                  <Wand2 size={10} /> Auto-Refine
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">
              Этап: <span className="text-zinc-200 uppercase font-semibold">{pipeline.currentStage}</span> • {pipeline.totalDurationMs}ms
            </p>
          </div>
        </div>

        {/* Confidence Score Metric Badge (> 90%) & D3 Graph Switch */}
        <div className="flex items-center gap-1.5">
          {onOpenGraphView && (
            <button
              onClick={onOpenGraphView}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-950/80 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/30 text-zinc-300 hover:text-emerald-300 text-[10px] font-mono font-semibold transition-all shadow-sm"
              title="Открыть D3 граф зависимостей пайплайна"
            >
              <Network size={13} className="text-emerald-400" />
              <span>D3 Граф</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-950/80 border border-emerald-500/30 shadow-inner">
            <ShieldCheck size={15} className="text-emerald-400" />
            <div className="text-right">
              <span className="text-[9px] text-zinc-400 uppercase font-medium block leading-none">Confidence Score</span>
              <span className="text-xs font-extrabold text-emerald-400 font-mono">
                {pipeline.overallConfidence}% <span className="text-[8px] text-emerald-400/80 font-normal">(&gt;90%)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* AUTO-REFINE PROPOSED ITERATIVE IMPROVEMENTS BLOCK       */}
      {/* ======================================================== */}
      {pipeline.refineProposal && (
        <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Wand2 size={14} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-cyan-200">Предложение Auto-Refine (Итеративное Улучшение)</h4>
                <p className="text-[10px] text-zinc-400">
                  Оптимизация кода перед финальной фиксацией • Прирост точности: +{pipeline.refineProposal.confidenceDelta}%
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDiffView(!showDiffView)}
              className="px-2 py-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-semibold transition-all"
            >
              {showDiffView ? "Скрыть сравнение" : "Показать Diff"}
            </button>
          </div>

          {/* List of Proposed Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pt-1">
            {pipeline.refineProposal.improvements.map((imp, idx) => (
              <div key={idx} className="flex items-start gap-1.5 p-1.5 rounded-md bg-zinc-950/60 border border-cyan-500/10 text-[11px] text-zinc-300">
                <Check size={12} className="text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{imp}</span>
              </div>
            ))}
          </div>

          {/* Interactive Diff / Comparison View */}
          {showDiffView && (
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="p-2 rounded-md bg-zinc-950 border border-red-500/20">
                <div className="text-red-400 font-bold mb-1 flex items-center gap-1">
                  <X size={10} /> Исходный вариант
                </div>
                <pre className="text-zinc-400 overflow-x-auto max-h-32">
                  {pipeline.refineProposal.originalCode}
                </pre>
              </div>
              <div className="p-2 rounded-md bg-zinc-950 border border-emerald-500/30">
                <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1">
                  <Check size={10} /> Улучшенный (Auto-Refined)
                </div>
                <pre className="text-emerald-200 overflow-x-auto max-h-32">
                  {pipeline.refineProposal.refinedCode}
                </pre>
              </div>
            </div>
          )}

          {onApplyRefinedCode && (
            <div className="flex justify-end pt-1">
              <button
                onClick={() => onApplyRefinedCode(pipeline.refineProposal!)}
                className="px-3 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Check size={13} />
                <span>Применить улучшения Auto-Refine</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SELF-IMPLEMENT PERSISTENT MODIFICATION APPROVAL GATE    */}
      {/* ======================================================== */}
      {pipeline.pendingApproval && (
        <div className="p-3 rounded-lg bg-amber-950/20 border-2 border-amber-500/40 shadow-xl space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldAlert size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-amber-200">Подтверждение Модификации Приложения (Self-Implement)</h4>
                  <span className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase",
                    pipeline.pendingApproval.status === 'pending_approval' ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse" :
                    pipeline.pendingApproval.status === 'approved' ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                    "bg-red-500/20 text-red-300 border border-red-500/30"
                  )}>
                    {pipeline.pendingApproval.status === 'pending_approval' ? 'Ожидает одобрения' :
                     pipeline.pendingApproval.status === 'approved' ? 'Одобрено и сохранено' : 'Отклонено'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {pipeline.pendingApproval.description}
                </p>
              </div>
            </div>
          </div>

          {/* List of files to be modified */}
          <div className="space-y-1">
            {pipeline.pendingApproval.changes.map((ch, cIdx) => (
              <div key={cIdx} className="p-2 rounded-md bg-zinc-950/80 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                    ch.action === 'create' ? "bg-emerald-500/20 text-emerald-400" :
                    ch.action === 'update' ? "bg-cyan-500/20 text-cyan-400" : "bg-red-500/20 text-red-400"
                  )}>
                    {ch.action}
                  </span>
                  <span className="text-zinc-200 text-[11px]">{ch.path}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{ch.language}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons with 4px spacing */}
          {pipeline.pendingApproval.status === 'pending_approval' && (
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-amber-500/20">
              {onRejectModification && (
                <button
                  onClick={() => onRejectModification(pipeline.pendingApproval!)}
                  className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <X size={13} />
                  <span>Отклонить</span>
                </button>
              )}
              {onApproveModification && (
                <button
                  onClick={() => onApproveModification(pipeline.pendingApproval!)}
                  className="px-3.5 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <Check size={14} />
                  <span>Утвердить и Применить в Систему</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 6 Stage Timeline Steps */}
      <div className="space-y-1.5">
        {pipeline.steps.map((step, idx) => {
          const isExpanded = expandedStepId === step.id;
          const isRunning = step.status === 'running';
          const isDone = step.status === 'completed';

          return (
            <div
              key={step.id}
              className={cn(
                "rounded-lg border transition-all duration-150 overflow-hidden",
                isRunning 
                  ? "bg-zinc-950/90 border-emerald-500/40 shadow-[0_0_12px_-3px_rgba(16,185,129,0.2)]" 
                  : isDone
                    ? "bg-zinc-950/50 border-white/5 hover:border-white/10"
                    : "bg-zinc-950/30 border-white/5 opacity-60"
              )}
            >
              {/* Step Header */}
              <div 
                onClick={() => toggleExpand(step.id)}
                className="p-2.5 flex items-center justify-between gap-2 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={cn(
                    "w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs font-mono font-bold",
                    isDone 
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : isRunning
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-spin"
                        : "bg-zinc-800 text-zinc-400"
                  )}>
                    {isDone ? <CheckCircle2 size={13} /> : idx + 1}
                  </div>
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-zinc-100 truncate">{step.stageLabel}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-white/5 text-zinc-400 font-mono">
                        {step.confidenceScore}%
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 truncate">{step.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {step.durationMs !== undefined && (
                    <span className="text-[9px] text-zinc-500 font-mono">{step.durationMs}ms</span>
                  )}
                  {isExpanded ? <ChevronUp size={13} className="text-zinc-400" /> : <ChevronDown size={13} className="text-zinc-400" />}
                </div>
              </div>

              {/* Step Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="px-3 pb-3 pt-1 border-t border-white/5 space-y-2"
                  >
                    <p className="text-xs text-zinc-300 leading-relaxed">{step.description}</p>

                    {/* Step Logs */}
                    {step.logs && step.logs.length > 0 && (
                      <div className="p-2.5 rounded-md bg-black/50 border border-white/5 font-mono text-[10px] text-zinc-400 space-y-1">
                        {step.logs.map((log, lIdx) => (
                          <div key={lIdx} className="leading-snug">
                            {log}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Code Snippet Card */}
                    {step.codeSnippet && (
                      <div className="p-2 rounded-md bg-zinc-900 border border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                            <FileCode size={12} />
                            {step.codeSnippet.filename}
                          </span>
                          {onSelectCodeSnippet && (
                            <button
                              onClick={() => onSelectCodeSnippet(step.codeSnippet!.filename, step.codeSnippet!.code)}
                              className="px-2 py-0.5 rounded bg-white/10 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-300 font-semibold text-[9px] transition-all"
                            >
                              Открыть в редакторе
                            </button>
                          )}
                        </div>
                        <pre className="text-[10px] font-mono text-zinc-300 bg-zinc-950 p-2 rounded-md overflow-x-auto max-h-32 leading-relaxed">
                          {step.codeSnippet.code}
                        </pre>
                      </div>
                    )}

                    {/* ESLint Audit Block */}
                    {step.eslintResult && (
                      <div className="p-2 rounded-md bg-zinc-900/90 border border-white/10 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={15} className={step.eslintResult.passed ? "text-emerald-400" : "text-amber-400"} />
                          <div>
                            <span className="font-semibold text-zinc-200 text-xs">ESLint / AST Валидация</span>
                            <p className="text-[9px] text-zinc-400 font-mono">
                              Ошибок: {step.eslintResult.errorsCount}, Предупреждений: {step.eslintResult.warningsCount}
                            </p>
                          </div>
                        </div>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase",
                          step.eslintResult.passed ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        )}>
                          {step.eslintResult.passed ? "PASSED" : "REVIEW"}
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
