/**
 * Nexus Orchestrator AI Workspace
 * Enterprise-grade Autonomous Agentic Pipeline (2026)
 * - 2 Main Views: Workspace & Agents
 * - 'Self-Implement' autonomous mode with explicit Approval Gate for persistent app modifications
 * - 'Auto-Refine' toggle for proposing iterative optimizations before final commitment
 * - '/create_skills' illuminated button for persistent RAG vector DB
 * - Multi-language live preview and interactive virtual filesystem
 * - Master Orchestrator plate + Specialized Agent Mesh plates
 * Spacing: 0px side edge bounds for background, 4px UI spacing.
 */

import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { WorkspaceView } from '@/components/Workspace/WorkspaceView';
import { AgentsView } from '@/components/Agents/AgentsView';
import { SkillsDrawer } from '@/components/Skills/SkillsDrawer';
import { 
  ChatMessage, 
  VirtualFile, 
  PipelineExecution, 
  AgentPlate,
  CodeLanguage,
  AutoRefineProposal,
  AppModificationProposal 
} from '@/types';
import { runAgenticWorkflowStream } from '@/services/geminiService';
import { workspaceStore } from '@/services/workspaceStore';
import { skillsStore } from '@/services/skillsStore';

export default function App() {
  // Navigation: 2 buttons only as requested
  const [activeTab, setActiveTab] = useState<'workspace' | 'agents'>('workspace');

  // Agentic Modes
  const [isSelfImplement, setIsSelfImplement] = useState<boolean>(true);
  const [isAutoRefine, setIsAutoRefine] = useState<boolean>(true);
  const [isSkillCreationMode, setIsSkillCreationMode] = useState<boolean>(false);
  const [isSkillsDrawerOpen, setIsSkillsDrawerOpen] = useState<boolean>(false);

  // Chat & Execution Pipeline State
  const [history, setHistory] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_chat_history_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentPipeline, setCurrentPipeline] = useState<PipelineExecution | undefined>(undefined);

  // Workspace Filesystem State
  const [files, setFiles] = useState<VirtualFile[]>(() => workspaceStore.getFiles());
  const [activeFilePath, setActiveFilePath] = useState<string>(() => workspaceStore.getActiveFile()?.path || '/src/App.tsx');
  const [skillsCount, setSkillsCount] = useState<number>(() => skillsStore.getAllSkills().length);

  // Sync virtual files when workspace store changes
  const refreshFiles = () => {
    setFiles(workspaceStore.getFiles());
    setSkillsCount(skillsStore.getAllSkills().length);
  };

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('nexus_chat_history_v2', JSON.stringify(history.slice(-30)));
    } catch (e) {
      console.warn('Failed to persist chat history:', e);
    }
  }, [history]);

  // Main Workflow Dispatcher
  const handleSendMessage = async (userQuery: string) => {
    if (!userQuery.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: userQuery,
      timestamp: new Date().toISOString()
    };

    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setIsProcessing(true);
    setCurrentPipeline(undefined);

    try {
      const assistantMessage = await runAgenticWorkflowStream(
        userQuery,
        {
          isSelfImplement,
          isSkillCreationMode,
          isAutoRefine,
          history: newHistory
        },
        (payload) => {
          if (payload.pipeline) {
            setCurrentPipeline(payload.pipeline);
          }
        }
      );

      setHistory(prev => [...prev, assistantMessage]);
      refreshFiles();
      if (assistantMessage.codeBlocks && assistantMessage.codeBlocks.length > 0) {
        setActiveFilePath(assistantMessage.codeBlocks[0].filename);
      }
    } catch (err) {
      console.error('Workflow error:', err);
    } finally {
      setIsProcessing(false);
      setCurrentPipeline(undefined);
    }
  };

  // ========================================================
  // APPROVAL GATE HANDLERS FOR PERSISTENT APP MODIFICATIONS
  // When Self-Implement is ON: changes are committed only after user approval!
  // ========================================================
  const handleApproveModification = (proposal: AppModificationProposal) => {
    proposal.status = 'approved';
    
    // Apply changes to persistent workspace store
    proposal.changes.forEach(ch => {
      if (ch.action === 'create' || ch.action === 'update') {
        workspaceStore.createFile(ch.path, ch.newContent, ch.language);
      } else if (ch.action === 'delete') {
        workspaceStore.deleteFile(ch.path);
      }
    });

    refreshFiles();
    if (proposal.changes.length > 0) {
      setActiveFilePath(proposal.changes[0].path);
    }

    // Update history messages reflecting approved state
    setHistory(prev => prev.map(msg => {
      if (msg.pipeline?.pendingApproval?.id === proposal.id) {
        return {
          ...msg,
          pipeline: {
            ...msg.pipeline,
            pendingApproval: {
              ...msg.pipeline.pendingApproval,
              status: 'approved'
            }
          }
        };
      }
      return msg;
    }));
  };

  const handleRejectModification = (proposal: AppModificationProposal) => {
    proposal.status = 'rejected';
    setHistory(prev => prev.map(msg => {
      if (msg.pipeline?.pendingApproval?.id === proposal.id) {
        return {
          ...msg,
          pipeline: {
            ...msg.pipeline,
            pendingApproval: {
              ...msg.pipeline.pendingApproval,
              status: 'rejected'
            }
          }
        };
      }
      return msg;
    }));
  };

  const handleApplyRefinedCode = (proposal: AutoRefineProposal) => {
    workspaceStore.createFile(proposal.filename, proposal.refinedCode, proposal.language);
    refreshFiles();
    setActiveFilePath(proposal.filename);
  };

  // Trigger from Agents View
  const handleTriggerAgent = (agent: AgentPlate, defaultPrompt?: string) => {
    setActiveTab('workspace');
    if (defaultPrompt) {
      handleSendMessage(`[${agent.name}]: ${defaultPrompt}`);
    }
  };

  // Virtual Filesystem Handlers
  const handleSelectFile = (path: string) => {
    workspaceStore.setActiveFile(path);
    setActiveFilePath(path);
    refreshFiles();
  };

  const handleSaveFile = (path: string, content: string) => {
    workspaceStore.updateFileContent(path, content);
    refreshFiles();
  };

  const handleCreateFile = (path: string, content: string, language: CodeLanguage) => {
    workspaceStore.createFile(path, content, language);
    setActiveFilePath(path);
    refreshFiles();
  };

  const handleDeleteFile = (path: string) => {
    workspaceStore.deleteFile(path);
    refreshFiles();
    setActiveFilePath(workspaceStore.getActiveFile()?.path || '/src/App.tsx');
  };

  const activeFile = files.find(f => f.path === activeFilePath) || files[0];

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200 px-0 m-0">
      
      {/* 2-Button Header Navigation with Self-Implement & RAG Controls */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSelfImplement={isSelfImplement}
        setIsSelfImplement={setIsSelfImplement}
        isSkillCreationMode={isSkillCreationMode}
        setIsSkillCreationMode={setIsSkillCreationMode}
        onOpenSkillsDrawer={() => setIsSkillsDrawerOpen(true)}
        skillsCount={skillsCount}
      />

      {/* Main Content Views with 0px background side edge bounds */}
      <main className="flex-1 flex flex-col min-h-0 w-full px-0">
        {activeTab === 'workspace' && (
          <WorkspaceView
            history={history}
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
            currentPipeline={currentPipeline}
            isSelfImplement={isSelfImplement}
            isSkillCreationMode={isSkillCreationMode}
            setIsSkillCreationMode={setIsSkillCreationMode}
            isAutoRefine={isAutoRefine}
            setIsAutoRefine={setIsAutoRefine}
            files={files}
            activeFile={activeFile}
            onSelectFile={handleSelectFile}
            onSaveFile={handleSaveFile}
            onCreateFile={handleCreateFile}
            onDeleteFile={handleDeleteFile}
            onOpenSkillsDrawer={() => setIsSkillsDrawerOpen(true)}
            onApproveModification={handleApproveModification}
            onRejectModification={handleRejectModification}
            onApplyRefinedCode={handleApplyRefinedCode}
          />
        )}

        {activeTab === 'agents' && (
          <div className="flex-1 overflow-y-auto w-full px-0">
            <AgentsView onTriggerAgent={handleTriggerAgent} />
          </div>
        )}
      </main>

      {/* Persistent Skills RAG Drawer */}
      <SkillsDrawer
        isOpen={isSkillsDrawerOpen}
        onClose={() => {
          setIsSkillsDrawerOpen(false);
          refreshFiles();
        }}
        onSelectSkillPrompt={(prompt) => {
          setActiveTab('workspace');
          handleSendMessage(prompt);
        }}
      />

    </div>
  );
}
