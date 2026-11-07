/**
 * Virtual Workspace Filesystem & Multi-Language Code Management
 */

import { VirtualFile, CodeLanguage } from '@/types';

const WORKSPACE_STORAGE_KEY = 'nexus_workspace_files_v2';

export const INITIAL_FILES: VirtualFile[] = [
  {
    path: '/src/App.tsx',
    name: 'App.tsx',
    language: 'typescript',
    content: `// Nexus React 19 Enterprise Dashboard
import React, { useState } from 'react';
import { Sparkles, Shield, Cpu, Zap, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [telemetry, setTelemetry] = useState({
    fps: 60,
    latency: '12ms',
    confidence: '99.4%',
    security: 'GUARD_ARMED'
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 flex flex-col items-center justify-center font-sans antialiased">
      <div className="w-full max-w-xl p-8 rounded-3xl bg-zinc-900/90 border border-white/10 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Nexus Live Preview</h1>
              <p className="text-xs text-zinc-400">Автономное окружение исполнения</p>
            </div>
          </div>
          <span className="px-3 py-1 text-xs font-mono font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {telemetry.confidence}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 my-6">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5">
            <span className="text-xs text-zinc-500 font-medium">Задержка сети (443)</span>
            <p className="text-xl font-bold text-white mt-1">{telemetry.latency}</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5">
            <span className="text-xs text-zinc-500 font-medium">Защита TLDRSec</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">{telemetry.security}</p>
          </div>
        </div>

        <button 
          onClick={() => alert("Система активна и готова к масштабированию!")}
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-[0.99]"
        >
          Проверить интерактивность
        </button>
      </div>
    </div>
  );
}`
  },
  {
    path: '/src/analytics.py',
    name: 'analytics.py',
    language: 'python',
    content: `# Polyglot Python Stream Analytics Engine
import json
import math
from typing import Dict, List, Any

class TelemetryAnalyzer:
    def __init__(self, confidence_threshold: float = 0.90):
        self.threshold = confidence_threshold
        self.history: List[float] = []

    def record_step(self, stage: str, score: float) -> Dict[str, Any]:
        """Регистрирует этап рекурсивного исполнения с оценкой точности."""
        self.history.append(score)
        passed = score >= self.threshold
        
        return {
            "stage": stage,
            "confidence": score,
            "passed": passed,
            "cumulative_avg": round(sum(self.history) / len(self.history), 4),
            "status": "APPROVED" if passed else "RECHECK_REQUIRED"
        }

if __name__ == "__main__":
    analyzer = TelemetryAnalyzer(0.90)
    for stage, val in [("analysis", 0.98), ("plan", 0.95), ("recheck", 0.99)]:
        res = analyzer.record_step(stage, val)
        print(f"Stage {stage}: {res['status']} ({res['confidence'] * 100}%)")
`
  },
  {
    path: '/src/main.rs',
    name: 'main.rs',
    language: 'rust',
    content: `// Rust Zero-Allocation Memory-Safe Worker
use std::sync::atomic::{AtomicU64, Ordering};

pub struct SystemGuard {
    requests_total: AtomicU64,
}

impl SystemGuard {
    pub const fn new() -> Self {
        Self {
            requests_total: AtomicU64::new(0),
        }
    }

    pub fn inspect_packet(&self, payload_len: usize) -> Result<(), &'static str> {
        if payload_len > 1_048_576 {
            return Err("Payload exceeds 1MB buffer limit");
        }
        self.requests_total.fetch_add(1, Ordering::Relaxed);
        Ok(())
    }
}

fn main() {
    let guard = SystemGuard::new();
    match guard.inspect_packet(512) {
        Ok(_) => println!("Security check passed on port 443!"),
        Err(e) => eprintln!("Security error: {}", e),
    }
}
`
  },
  {
    path: '/public/index.html',
    name: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexus Live HTML Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-zinc-950 text-white min-h-screen flex items-center justify-center p-6">
  <div class="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-center">
    <div class="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-4">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
    </div>
    <h2 class="text-xl font-bold mb-2">Live DOM Renderer</h2>
    <p class="text-zinc-400 text-sm mb-6">Интерактивный HTML/CSS рендерер с поддержкой Tailwind CSS в реальном времени.</p>
    <button onclick="document.getElementById('status-txt').innerText = 'Тест пройден! Состояние обновлено.'" class="w-full py-3 bg-emerald-500 text-zinc-950 font-bold rounded-2xl hover:bg-emerald-400 transition-all">
      Выполнить действие
    </button>
    <p id="status-txt" class="mt-4 text-xs font-mono text-emerald-400"></p>
  </div>
</body>
</html>`
  },
  {
    path: '/docs/architecture.md',
    name: 'architecture.md',
    language: 'markdown',
    content: `# Архитектура Nexus Orchestrator

## Рекурсивный Конвейер Выполнения
1. **Анализ (Analysis)**: Декомпозиция цели и контекста.
2. **План (Plan)**: Определение модулей и интерфейсов.
3. **Этапы (Stages)**: Пошаговая последовательность.
4. **Части (Parts)**: Сборка исходных файлов.
5. **Шаги (Steps)**: Выполнение и тестирование.
6. **Перепроверка (Recheck)**: ESLint + AST + TLDRSec аудит с гарантией точности > 90%.

## RAG База Навыков
Автономное пополнение базы знаний через режим \`/create_skills\`.
`
  }
];

export class WorkspaceStore {
  private static instance: WorkspaceStore;
  private files: VirtualFile[] = [];
  private activeFilePath: string = '/src/App.tsx';

  private constructor() {
    this.loadFiles();
  }

  public static getInstance(): WorkspaceStore {
    if (!WorkspaceStore.instance) {
      WorkspaceStore.instance = new WorkspaceStore();
    }
    return WorkspaceStore.instance;
  }

  private loadFiles(): void {
    try {
      const stored = localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.files = parsed;
          this.activeFilePath = this.files[0]?.path || '/src/App.tsx';
          return;
        }
      }
    } catch (e) {
      console.warn('Could not read workspace files from localStorage:', e);
    }
    this.files = [...INITIAL_FILES];
    this.activeFilePath = '/src/App.tsx';
    this.persist();
  }

  private persist(): void {
    try {
      localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(this.files));
    } catch (e) {
      console.error('Failed to persist workspace files:', e);
    }
  }

  public getFiles(): VirtualFile[] {
    return [...this.files];
  }

  public getActiveFile(): VirtualFile | undefined {
    return this.files.find(f => f.path === this.activeFilePath) || this.files[0];
  }

  public setActiveFile(path: string): void {
    this.activeFilePath = path;
  }

  public updateFileContent(path: string, newContent: string): void {
    const file = this.files.find(f => f.path === path);
    if (file) {
      file.content = newContent;
      file.isModified = true;
      file.updatedAt = new Date().toISOString();
      this.persist();
    }
  }

  public createFile(path: string, content: string, language: CodeLanguage): VirtualFile {
    const existing = this.files.find(f => f.path === path);
    if (existing) {
      existing.content = content;
      existing.isModified = true;
      existing.updatedAt = new Date().toISOString();
      this.persist();
      return existing;
    }

    const name = path.split('/').pop() || 'untitled';
    const newFile: VirtualFile = {
      path,
      name,
      language,
      content,
      isModified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.files.push(newFile);
    this.activeFilePath = path;
    this.persist();
    return newFile;
  }

  public deleteFile(path: string): boolean {
    const prev = this.files.length;
    this.files = this.files.filter(f => f.path !== path);
    if (this.files.length !== prev) {
      if (this.activeFilePath === path) {
        this.activeFilePath = this.files[0]?.path || '';
      }
      this.persist();
      return true;
    }
    return false;
  }
}

export const workspaceStore = WorkspaceStore.getInstance();
