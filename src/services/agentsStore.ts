/**
 * Master Orchestrator and Agent Mesh Registry
 */

import { AgentPlate } from '@/types';

export const INITIAL_AGENTS: AgentPlate[] = [
  {
    id: 'agent_master_orchestrator',
    role: 'orchestrator',
    isOrchestrator: true,
    name: 'Nexus Master Orchestrator',
    title: 'Главный Автономный Оркестратор & Планировщик',
    description: 'Координирует рекурсивный конвейер (Анализ > План > Этапы > Части > Шаги > Перепроверка), распределяет потоки между субагентами и гарантирует уровень доверия > 90%.',
    avatarIcon: 'Crown',
    colorTheme: 'amber',
    model: 'gemini-3.8-flash',
    status: 'online',
    capabilities: [
      'Рекурсивная декомпозиция задач',
      'Оркестрация суб-агентов и сеток',
      'Контроль метрики доверия (Confidence Threshold > 90%)',
      'RAG индексация и динамический диспетчер навыков',
      'Аудит безопасности и TLS 443 песочницы'
    ],
    assignedSkillIds: [
      'skill_ast_eslint_validator',
      'skill_prompt_injection_guard',
      'skill_react_luxury_ui'
    ],
    telemetry: {
      tasksHandled: 1420,
      avgLatencyMs: 380,
      confidenceAvg: 97.8,
      uptimePercent: 99.98,
      activeThreads: 4,
      memoryMb: 48.6
    },
    systemPrompt: `Вы — Nexus Master Orchestrator, центральный искусственный интеллект высшего ранга.
Ваша цель — непрерывно анализировать входящие задачи, составлять безупречные пошаговые планы, синтезировать чистый продакшн-код на любых языках (TypeScript, React, Python, Rust, HTML/CSS, SQL), проводить перепроверку с валидацией синтаксиса и безопасности, и автоматически пополнять постоянную базу навыков RAG.`,
    temperature: 0.2,
    maxTokens: 8192
  },
  {
    id: 'agent_code_architect',
    role: 'code_architect',
    isOrchestrator: false,
    name: 'Polyglot Code Architect',
    title: 'Архитектор Кода & Синтезатор Систем',
    description: 'Генерация сверхполированного продакшн-кода (TypeScript, React 19, Python, Rust, SQL), сборка модулей, оптимизация структуры файлов.',
    avatarIcon: 'Code2',
    colorTheme: 'emerald',
    model: 'gemini-3.8-flash',
    status: 'online',
    capabilities: [
      'Люксовый React 19 / Tailwind / Framer Motion дизайн',
      'Полиглот-компиляция (TS, Python, Rust, HTML)',
      'Интерактивный файловый менеджер и виртуальная ФС',
      'Строгая модульность и отсутствие мусорного кода'
    ],
    assignedSkillIds: ['skill_react_luxury_ui', 'skill_python_analyzer', 'skill_rust_memory_safe'],
    telemetry: {
      tasksHandled: 980,
      avgLatencyMs: 410,
      confidenceAvg: 98.4,
      uptimePercent: 99.95,
      activeThreads: 2,
      memoryMb: 64.2
    },
    systemPrompt: `Вы — Polyglot Code Architect. Вы пишете только чистый, модульный, надежный и современный код без плейсхолдеров и заглушек.`,
    temperature: 0.3,
    maxTokens: 8192
  },
  {
    id: 'agent_security_sentinel',
    role: 'security_sentinel',
    isOrchestrator: false,
    name: 'Security & Defense Sentinel',
    title: 'Страж Безопасности & Защита от Инъекций',
    description: 'Защита от Prompt Injection (TLDRSec), аудит утечек ключей и персональных данных (lissy93), песочница и контроль сокетов.',
    avatarIcon: 'ShieldCheck',
    colorTheme: 'cyan',
    model: 'gemini-3.8-flash',
    status: 'online',
    capabilities: [
      'TLDRSec эвристический анализ инъекций',
      'Personal Security Checklist & Redaction',
      'Сетевая изоляция (только HTTPS / Port 443)',
      'Анализ рисков и аудит прав доступа'
    ],
    assignedSkillIds: ['skill_prompt_injection_guard'],
    telemetry: {
      tasksHandled: 2310,
      avgLatencyMs: 120,
      confidenceAvg: 99.4,
      uptimePercent: 100.0,
      activeThreads: 1,
      memoryMb: 24.1
    },
    systemPrompt: `Вы — Security & Defense Sentinel. Вы сканируете любые промпты и код на уязвимости, утечки токенов и инъекции.`,
    temperature: 0.1,
    maxTokens: 4096
  },
  {
    id: 'agent_rag_curator',
    role: 'rag_curator',
    isOrchestrator: false,
    name: 'RAG Knowledge & Skills Curator',
    title: 'Куратор Базы Знаний & Навыков RAG',
    description: 'Автоматическая экстракция навыков в постоянную память, семантический поиск релевантных инструментов по естественному языку.',
    avatarIcon: 'Database',
    colorTheme: 'purple',
    model: 'gemini-3.8-flash',
    status: 'online',
    capabilities: [
      'Автоматическое создание навыков через /create_skills',
      'Векторизация и быстрый RAG поиск',
      'Персистентное сохранение в хранилище',
      'Экспорт / Импорт баз знаний'
    ],
    assignedSkillIds: ['skill_ast_eslint_validator'],
    telemetry: {
      tasksHandled: 740,
      avgLatencyMs: 290,
      confidenceAvg: 96.9,
      uptimePercent: 99.9,
      activeThreads: 1,
      memoryMb: 36.8
    },
    systemPrompt: `Вы — RAG Knowledge & Skills Curator. Вы структурируете и сохраняете навыки агентов.`,
    temperature: 0.2,
    maxTokens: 4096
  },
  {
    id: 'agent_preview_runtime',
    role: 'preview_runtime',
    isOrchestrator: false,
    name: 'Live Preview & Sandbox Engine',
    title: 'Среда Исполнения & Живой Превьюер',
    description: 'Интерактивный рендеринг веб-компонентов, эмуляция полиглот-рантайма, перехват консольных логов и визуализация DOM.',
    avatarIcon: 'PlayCircle',
    colorTheme: 'rose',
    model: 'gemini-3.8-flash',
    status: 'online',
    capabilities: [
      'Мгновенный Live Preview HTML/CSS/React',
      'Потоковый перехват логов браузерной консоли',
      'Интерактивная песочница с адаптивным режимом',
      'Тестирование верстки на мобильных экранах'
    ],
    assignedSkillIds: ['skill_react_luxury_ui'],
    telemetry: {
      tasksHandled: 1120,
      avgLatencyMs: 180,
      confidenceAvg: 98.7,
      uptimePercent: 99.99,
      activeThreads: 2,
      memoryMb: 52.0
    },
    systemPrompt: `Вы — Live Preview & Sandbox Engine. Вы рендерите и тестируете код в реальном времени.`,
    temperature: 0.1,
    maxTokens: 4096
  }
];
