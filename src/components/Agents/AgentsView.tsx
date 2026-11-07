/**
 * Agents Mesh View
 * Prominent Master Orchestrator plate atop the screen + specialized sub-agent plates.
 */

import React, { useState } from 'react';
import { 
  Bot, 
  Crown, 
  Code2, 
  ShieldCheck, 
  Database, 
  PlayCircle, 
  Activity, 
  Zap, 
  Sparkles, 
  CheckCircle2,
  Settings2,
  Terminal,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AgentPlate } from '@/types';
import { INITIAL_AGENTS } from '@/services/agentsStore';
import { cn } from '@/lib/utils';

interface AgentsViewProps {
  onTriggerAgent: (agent: AgentPlate, defaultPrompt?: string) => void;
}

export const AgentsView: React.FC<AgentsViewProps> = ({ onTriggerAgent }) => {
  const [agents, setAgents] = useState<AgentPlate[]>(INITIAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<AgentPlate | null>(null);

  const masterOrchestrator = agents.find(a => a.isOrchestrator) || agents[0];
  const subAgents = agents.filter(a => !a.isOrchestrator);

  const getAgentIcon = (iconName: string, role: string) => {
    switch (iconName) {
      case 'Crown':
        return <Crown size={22} className="text-amber-400" />;
      case 'Code2':
        return <Code2 size={20} className="text-emerald-400" />;
      case 'ShieldCheck':
        return <ShieldCheck size={20} className="text-cyan-400" />;
      case 'Database':
        return <Database size={20} className="text-purple-400" />;
      case 'PlayCircle':
        return <PlayCircle size={20} className="text-rose-400" />;
      default:
        return <Bot size={20} className="text-emerald-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* 1. MASTER ORCHESTRATOR PLATE (Settled as a separate luxury plate as requested) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-xs font-bold uppercase tracking-wider">
              Master Orchestrator
            </span>
            <span className="text-xs text-zinc-400">• Центральный Командный Узел</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-zinc-900 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Сетка Активна (Confidence &gt; 90%)</span>
          </div>
        </div>

        {/* Master Card Frame */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-amber-500/30 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.15)] backdrop-blur-2xl relative overflow-hidden">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            
            {/* Master Agent Identity */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.3)] shrink-0">
                <Crown size={32} className="text-amber-400" />
              </div>

              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-['Syne',sans-serif]">
                    {masterOrchestrator.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold">
                    {masterOrchestrator.model}
                  </span>
                </div>
                
                <p className="text-xs sm:text-sm text-zinc-300 font-medium">
                  {masterOrchestrator.title}
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {masterOrchestrator.description}
                </p>
              </div>
            </div>

            {/* Master Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-950/60 p-4 rounded-2xl border border-white/5 shrink-0">
              <div>
                <span className="text-[10px] text-zinc-500 font-medium uppercase font-mono block">Порог Точности</span>
                <span className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono">
                  {masterOrchestrator.telemetry.confidenceAvg}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-medium uppercase font-mono block">Задач Выполнено</span>
                <span className="text-sm sm:text-base font-bold text-white font-mono">
                  {masterOrchestrator.telemetry.tasksHandled}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-medium uppercase font-mono block">Средняя Задержка</span>
                <span className="text-sm sm:text-base font-bold text-amber-300 font-mono">
                  {masterOrchestrator.telemetry.avgLatencyMs}ms
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-medium uppercase font-mono block">Безопасность</span>
                <span className="text-sm sm:text-base font-bold text-cyan-400 font-mono">
                  TLS 443
                </span>
              </div>
            </div>

          </div>

          {/* Master Capabilities & Quick Triggers */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex flex-wrap items-center gap-1.5">
              {masterOrchestrator.capabilities.map((cap, cIdx) => (
                <span key={cIdx} className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] text-zinc-300 font-medium">
                  {cap}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setSelectedAgent(masterOrchestrator)}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Settings2 size={14} />
                <span>Настройки</span>
              </button>

              <button
                onClick={() => onTriggerAgent(masterOrchestrator, "Спланируй и выполни полную рекурсивную декомпозицию архитектуры")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all flex items-center gap-2 active:scale-95"
              >
                <Zap size={15} fill="currentColor" />
                <span>Запустить в Workspace</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 2. SPECIALIZED SUB-AGENT PLATES MESH */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs font-bold uppercase tracking-wider">
              Agent Mesh Plates
            </span>
            <span className="text-xs text-zinc-400">• Специализированные Исполнители</span>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            {subAgents.length} активных агентов
          </span>
        </div>

        {/* Sub-Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subAgents.map((agent) => (
            <div
              key={agent.id}
              className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 hover:border-white/20 transition-all duration-200 shadow-xl backdrop-blur-xl flex flex-col justify-between gap-5 group"
            >
              <div className="space-y-4">
                {/* Agent Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center border shadow-md shrink-0",
                      agent.colorTheme === 'emerald' && "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
                      agent.colorTheme === 'cyan' && "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
                      agent.colorTheme === 'purple' && "bg-purple-500/15 border-purple-500/30 text-purple-400",
                      agent.colorTheme === 'rose' && "bg-rose-500/15 border-rose-500/30 text-rose-400"
                    )}>
                      {getAgentIcon(agent.avatarIcon, agent.role)}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">{agent.name}</h3>
                      <p className="text-xs text-zinc-400 font-medium">{agent.title}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400">
                    {agent.telemetry.confidenceAvg}%
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {agent.description}
                </p>

                {/* Capabilities Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {agent.capabilities.slice(0, 3).map((cap, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-zinc-950 text-[10px] text-zinc-400 border border-white/5">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Metrics & Trigger */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                  <span>Задач: <b className="text-white">{agent.telemetry.tasksHandled}</b></span>
                  <span>•</span>
                  <span>Задержка: <b className="text-white">{agent.telemetry.avgLatencyMs}ms</b></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedAgent(agent)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                    title="Настройки агента"
                  >
                    <Settings2 size={14} />
                  </button>

                  <button
                    onClick={() => onTriggerAgent(agent, `Выполни задачу по специализации: ${agent.title}`)}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-zinc-950 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Zap size={13} />
                    <span>Вызвать</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Agent Configuration Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-zinc-900 border border-white/15 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {getAgentIcon(selectedAgent.avatarIcon, selectedAgent.role)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedAgent.name}</h3>
                  <p className="text-xs text-zinc-400">{selectedAgent.title}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="p-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-medium block mb-1">Модель LLM</label>
                <div className="p-2.5 rounded-xl bg-zinc-950 font-mono text-zinc-200 border border-white/10">
                  {selectedAgent.model}
                </div>
              </div>

              <div>
                <label className="text-zinc-400 font-medium block mb-1">Системный Промпт</label>
                <textarea
                  value={selectedAgent.systemPrompt}
                  readOnly
                  rows={4}
                  className="w-full p-3 rounded-xl bg-zinc-950 font-mono text-zinc-300 border border-white/10 resize-none outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-zinc-950 border border-white/5">
                  <span className="text-zinc-500 font-medium block">Температура</span>
                  <span className="text-sm font-bold text-white font-mono">{selectedAgent.temperature}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-white/5">
                  <span className="text-zinc-500 font-medium block">Память RAG</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">{selectedAgent.telemetry.memoryMb} MB</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
