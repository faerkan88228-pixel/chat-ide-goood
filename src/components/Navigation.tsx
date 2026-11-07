/**
 * Navigation Bar - 2 Main Tabs: Workspace & Agents
 * Luxury Enterprise Header with 'Self-Implement' Switch & Security Telemetry
 * Spacing: 0px side edge bounds for background, 4px UI spacing.
 */

import React from 'react';
import { 
  Bot, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Terminal,
  Activity,
  Code2,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: 'workspace' | 'agents';
  setActiveTab: (tab: 'workspace' | 'agents') => void;
  isSelfImplement: boolean;
  setIsSelfImplement: (val: boolean) => void;
  isSkillCreationMode: boolean;
  setIsSkillCreationMode: (val: boolean) => void;
  onOpenSkillsDrawer: () => void;
  skillsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  isSelfImplement,
  setIsSelfImplement,
  isSkillCreationMode,
  setIsSkillCreationMode,
  onOpenSkillsDrawer,
  skillsCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-zinc-950/95 backdrop-blur-xl shrink-0 px-0">
      <div className="w-full px-2 sm:px-4 h-14 flex items-center justify-between gap-2">
        
        {/* Brand Logo & Telemetry */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <Cpu size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white flex items-center gap-1 font-['Syne',sans-serif]">
                NEXUS <span className="text-emerald-400 font-mono text-[10px] font-semibold px-1 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">ORCHESTRATOR</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-emerald-400">TLS 443</span>
              </span>
              <span>•</span>
              <span>99.8% Conf.</span>
            </div>
          </div>
        </div>

        {/* The 2 Main Navigation Buttons as requested */}
        <nav className="flex items-center p-1 rounded-xl bg-zinc-900/90 border border-white/10 shadow-inner gap-1">
          <button
            id="nav-btn-workspace"
            onClick={() => setActiveTab('workspace')}
            className={cn(
              "flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150",
              activeTab === 'workspace'
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-zinc-950 shadow-[0_0_14px_rgba(16,185,129,0.35)] font-bold"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            )}
          >
            <Terminal size={14} />
            <span>Workspace</span>
          </button>

          <button
            id="nav-btn-agents"
            onClick={() => setActiveTab('agents')}
            className={cn(
              "flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150",
              activeTab === 'agents'
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-zinc-950 shadow-[0_0_14px_rgba(16,185,129,0.35)] font-bold"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            )}
          >
            <Bot size={14} />
            <span>Agents</span>
          </button>
        </nav>

        {/* Controls: 'Self-Implement' Toggle & Skills RAG Button */}
        <div className="flex items-center gap-1.5">
          
          {/* Skills RAG DB Quick Access */}
          <button
            id="nav-btn-skills-rag"
            onClick={onOpenSkillsDrawer}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-purple-500/40 text-xs font-medium text-zinc-300 hover:text-white transition-all shadow-sm group"
          >
            <Database size={13} className="text-purple-400 group-hover:scale-110 transition-transform" />
            <span>RAG Навыки</span>
            <span className="px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono text-[9px]">
              {skillsCount}
            </span>
          </button>

          {/* 'Self-Implement' Mode Switch (Autonomous pipeline on/off) */}
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/10">
            <button
              id="toggle-self-implement"
              onClick={() => setIsSelfImplement(!isSelfImplement)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                isSelfImplement
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_14px_-2px_rgba(245,158,11,0.35)]"
                  : "bg-zinc-900 border-white/10 text-zinc-400 hover:text-zinc-200"
              )}
              title="Режим Self-Implement: агент готовит изменения приложения для персистентной записи после одобрения"
            >
              <Zap size={13} className={cn(isSelfImplement ? "text-amber-400 animate-bounce" : "text-zinc-500")} />
              <span className="hidden sm:inline">Self-Implement:</span>
              <span className={cn(
                "font-mono uppercase text-[10px] px-1 py-0.5 rounded",
                isSelfImplement ? "bg-amber-400 text-zinc-950 font-bold" : "bg-zinc-800 text-zinc-400"
              )}>
                {isSelfImplement ? "ON" : "OFF"}
              </span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
