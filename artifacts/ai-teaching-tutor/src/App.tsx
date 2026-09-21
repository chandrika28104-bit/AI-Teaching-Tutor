import { type ReactNode, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  GraduationCap,
  Headphones,
  Lightbulb,
  Menu,
  Pause,
  PencilLine,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Volume2,
  WandSparkles,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import {
  LessonCheckpoint,
  type CheckpointState,
} from '@/components/lesson-checkpoint';
import {
  buildLesson,
  defaultSetup,
  type BoardAction,
  type Lesson,
  type LessonStep,
  type TopicSetup,
} from '@/lib/lesson-engine';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function LogoMark() {
  return (
    <div className="flex items-center gap-3" data-testid="brand-teachwell">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-[13px] bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] shadow-[4px_4px_0_hsl(var(--primary)/.16)]">
        <GraduationCap size={21} strokeWidth={2.2} />
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[hsl(var(--background))] bg-[hsl(var(--primary))]" />
      </div>
      <div>
        <div className="text-[15px] font-bold tracking-[-.03em] text-[hsl(var(--foreground))]">teachwell</div>
        <div className="font-mono text-[9px] uppercase tracking-[.17em] text-[hsl(var(--muted-foreground))]">your patient tutor</div>
      </div>
    </div>
  );
}

function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[11px] font-bold uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">
      {children}
    </label>
  );
}

function SetupView({
  setup,
  setSetup,
  onStart,
  isStarting,
}: {
  setup: TopicSetup;
  setSetup: (value: TopicSetup) => void;
  onStart: () => void;
  isStarting: boolean;
}) {
  const update = (key: keyof TopicSetup, value: string) => setSetup({ ...setup, [key]: value });
  return (
    <div className="classroom-shell noise min-h-[100dvh] overflow-hidden">
      <header className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <LogoMark />
        <div className="hidden items-center gap-5 text-xs font-medium text-[hsl(var(--muted-foreground))] sm:flex">
          <span className="flex items-center gap-2"><span className="animate-dot h-2 w-2 rounded-full bg-[hsl(var(--accent))]" /> A calmer way to learn</span>
          <button className="soft-focus rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] px-4 py-2 transition hover:border-[hsl(var(--primary)/.4)] hover:bg-[hsl(var(--card))]" data-testid="button-how-it-works">How it works</button>
        </div>
        <button className="soft-focus rounded-full p-2 text-[hsl(var(--muted-foreground))] sm:hidden" aria-label="Open menu" data-testid="button-open-menu"><Menu size={20} /></button>
      </header>

      <main className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(460px,.96fr)] lg:gap-20 lg:px-16 lg:pb-24 lg:pt-14">
        <section className="animate-rise max-w-[680px]">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--accent)/.45)] bg-[hsl(var(--accent)/.13)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.15em] text-[hsl(var(--primary))]">
            <Sparkles size={13} /> A better first step
          </div>
          <h1 className="max-w-[690px] text-[clamp(3.2rem,7vw,6.55rem)] font-semibold leading-[.94] tracking-[-.075em] text-[hsl(var(--foreground))]" style={{ fontFamily: 'var(--app-font-serif)' }}>
            Learn it<br /><span className="text-[hsl(var(--primary))]">like a human.</span>
          </h1>
          <p className="mt-7 max-w-[510px] text-[17px] leading-8 text-[hsl(var(--muted-foreground))]">
            Sit down with a patient teacher who makes room for the questions you were almost too shy to ask.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-[hsl(var(--muted-foreground))]">
            <span className="flex items-center gap-2"><PencilLine size={15} className="text-[hsl(var(--primary))]" /> Step by step</span>
            <span className="flex items-center gap-2"><Headphones size={15} className="text-[hsl(var(--primary))]" /> Spoken explanations</span>
            <span className="flex items-center gap-2"><BrainCircuit size={15} className="text-[hsl(var(--primary))]" /> Built around you</span>
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .14, duration: .65 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-[hsl(var(--accent)/.12)] blur-2xl" />
          <div className="relative rounded-[24px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/.88)] p-5 shadow-[0_22px_65px_hsl(164_31%_16%/.11)] backdrop-blur sm:p-8">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--muted-foreground))]">Your next lesson</div>
                <h2 className="mt-2 text-[27px] font-semibold tracking-[-.045em]" style={{ fontFamily: 'var(--app-font-serif)' }}>What are we exploring?</h2>
              </div>
              <div className="rounded-2xl bg-[hsl(var(--secondary))] p-3 text-[hsl(var(--primary))]"><WandSparkles size={20} /></div>
            </div>

            <div className="space-y-5">
              <div>
                <FieldLabel htmlFor="topic">I want to learn about</FieldLabel>
                <div className="relative">
                  <BookOpen size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--primary))]" />
                  <input id="topic" value={setup.topic} onChange={(event) => update('topic', event.target.value)} className="soft-focus h-14 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background)/.62)] pl-11 pr-4 text-[16px] font-semibold outline-none transition placeholder:text-[hsl(var(--muted-foreground)/.7)] focus:border-[hsl(var(--primary)/.6)] focus:bg-[hsl(var(--card))]" placeholder="Try “photosynthesis”" data-testid="input-topic" />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="level">My level</FieldLabel>
                  <select id="level" value={setup.level} onChange={(event) => update('level', event.target.value)} className="select-chevron soft-focus h-12 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background)/.62)] px-4 text-sm font-semibold outline-none transition focus:border-[hsl(var(--primary)/.6)]" data-testid="select-level">
                    <option>Curious beginner</option><option>Some familiarity</option><option>Exam-ready</option>
                  </select>
                </div>
                <div>
                  <FieldLabel htmlFor="goal">My goal</FieldLabel>
                  <select id="goal" value={setup.goal} onChange={(event) => update('goal', event.target.value)} className="select-chevron soft-focus h-12 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background)/.62)] px-4 text-sm font-semibold outline-none transition focus:border-[hsl(var(--primary)/.6)]" data-testid="select-goal">
                    <option>Understand the big picture</option><option>Prepare for a test</option><option>Practice explaining it</option>
                  </select>
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="style">Teach me in a style that feels</FieldLabel>
                <div className="grid grid-cols-3 gap-2">
                  {['Patient & visual', 'Curious & Socratic', 'Quick & focused'].map((style) => (
                    <button key={style} onClick={() => update('style', style)} className={`soft-focus rounded-2xl border px-3 py-3 text-left text-[11px] font-bold leading-4 transition ${setup.style === style ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-[0_6px_16px_hsl(var(--primary)/.18)]' : 'border-[hsl(var(--border))] bg-[hsl(var(--background)/.45)] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/.45)]'}`} data-testid={`button-style-${style.toLowerCase().replaceAll(' ', '-')}`}>{style}</button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={onStart} disabled={isStarting || !setup.topic.trim()} className="soft-focus mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[hsl(var(--primary))] text-[15px] font-bold text-[hsl(var(--primary-foreground))] shadow-[0_10px_24px_hsl(var(--primary)/.22)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_hsl(var(--primary)/.27)] disabled:cursor-not-allowed disabled:opacity-60" data-testid="button-start-lesson">
              {isStarting ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-[hsl(var(--primary-foreground)/.35)] border-t-[hsl(var(--primary-foreground))]" /> Preparing your lesson</> : <>Begin the lesson <ArrowRight size={18} /></>}
            </button>
            <p className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-[hsl(var(--muted-foreground))]"><Clock3 size={13} /> A focused session takes about 8 minutes</p>
          </div>
        </motion.section>
      </main>
      <footer className="mx-auto flex max-w-[1440px] items-center justify-between px-5 pb-7 text-[10px] font-bold uppercase tracking-[.16em] text-[hsl(var(--muted-foreground)/.7)] sm:px-8 lg:px-16">
        <span>Less rushing. More understanding.</span><span className="hidden sm:inline">Made for the curious</span>
      </footer>
    </div>
  );
}

function ProgressRail({ lesson }: { lesson: Lesson }) {
  return (
    <aside className="hidden w-[205px] shrink-0 border-r border-[hsl(var(--border))] bg-[hsl(var(--card)/.34)] px-6 py-8 lg:block">
      <div className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">Today’s path</div>
      <div className="mt-8 space-y-0">
        {lesson.steps.map((step, index) => {
          const isDone = index < lesson.currentStep;
          const isActive = index === lesson.currentStep;
          return (
            <div className="relative flex gap-3 pb-7" key={step.title} data-testid={`step-rail-${index}`}>
              {index < lesson.steps.length - 1 && <div className={`absolute left-[11px] top-7 h-[calc(100%-14px)] w-px ${isDone ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--border))]'}`} />}
              <div className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${isDone ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : isActive ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent)/.3)] text-[hsl(var(--foreground))]' : 'border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))]'}`}>{isDone ? <Check size={13} /> : index + 1}</div>
              <div className="pt-0.5">
                <div className={`text-[12px] font-bold leading-4 ${isActive ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'}`}>{step.title}</div>
                {isActive && <div className="mt-1 font-mono text-[9px] uppercase tracking-[.12em] text-[hsl(var(--accent-foreground))]">You are here</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 rounded-2xl bg-[hsl(var(--secondary)/.6)] p-4">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-bold"><Lightbulb size={14} className="text-[hsl(var(--accent-foreground))]" /> Learning pulse</div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[hsl(var(--border))]"><div className="h-full rounded-full bg-[hsl(var(--accent))] transition-all duration-500" style={{ width: `${lesson.progress}%` }} /></div>
        <div className="mt-2 text-[10px] text-[hsl(var(--muted-foreground))]">{lesson.progress}% of this lesson</div>
      </div>
    </aside>
  );
}

function Board({
  step,
  boardMode,
  onToggle,
}: {
  step: LessonStep;
  boardMode: 'chalkboard' | 'whiteboard';
  onToggle: (mode: 'chalkboard' | 'whiteboard') => void;
}) {
  const actions = step.boardActions ?? [];
  const [visibleActions, setVisibleActions] = useState<BoardAction[]>([]);
  const [actionIndex, setActionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const dark = boardMode === 'chalkboard';

  useEffect(() => {
    setVisibleActions([]);
    setActionIndex(0);
    setIsPlaying(true);
  }, [step]);

  useEffect(() => {
    if (!isPlaying || actionIndex >= actions.length) return;
    const timer = window.setTimeout(() => {
      const action = actions[actionIndex];
      setVisibleActions((current) => {
        if (action.type === 'erase') {
          if (action.targetId) return current.filter((item) => item.id !== action.targetId);
          return current.slice(0, -1);
        }
        return [...current, action];
      });
      setActionIndex((current) => current + 1);
    }, actionIndex === 0 ? 480 : 820);
    return () => window.clearTimeout(timer);
  }, [actionIndex, actions, isPlaying]);

  const replay = () => {
    setVisibleActions([]);
    setActionIndex(0);
    setIsPlaying(true);
  };

  return (
    <div className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">
          <PencilLine size={14} /> On the board
          <span className="font-mono text-[9px] font-normal tracking-[.08em] text-[hsl(var(--muted-foreground)/.7)]">
            {Math.min(actionIndex, actions.length)} / {actions.length} notes
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying((current) => !current)}
            className="soft-focus flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] px-2.5 py-1.5 text-[10px] font-bold text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--foreground))]"
            aria-label={isPlaying ? 'Pause teacher writing' : 'Resume teacher writing'}
            data-testid="button-board-playback"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            {isPlaying ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={replay}
            className="soft-focus rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] px-2.5 py-1.5 text-[10px] font-bold text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--foreground))]"
            data-testid="button-board-replay"
          >
            Replay
          </button>
          <div className="flex rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] p-1">
            {(['chalkboard', 'whiteboard'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onToggle(mode)}
                className={`soft-focus rounded-lg px-2.5 py-1.5 text-[10px] font-bold capitalize transition ${boardMode === mode ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`}
                data-testid={`button-board-${mode}`}
              >
                {mode === 'chalkboard' ? 'Chalk' : 'White'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <motion.div
        layout
        className={`min-h-[360px] rounded-[22px] p-7 sm:min-h-[430px] sm:p-10 ${dark ? 'chalkboard text-[hsl(40_33%_95%/.92)]' : 'whiteboard text-[hsl(var(--foreground))]'}`}
        data-testid="board-content"
      >
        <div className={`mb-8 flex items-center justify-between border-b pb-4 ${dark ? 'border-[hsl(40_33%_98%/.16)]' : 'border-[hsl(var(--foreground)/.14)]'}`}>
          <span className={`font-mono text-[9px] uppercase tracking-[.2em] ${dark ? 'text-[hsl(29_79%_74%)]' : 'text-[hsl(var(--primary))]'}`}>
            {dark ? 'chalk notes / live' : 'working notes / live'}
          </span>
          <span className={`h-2 w-2 rounded-full ${isPlaying && actionIndex < actions.length ? 'animate-pulse' : ''} ${dark ? 'bg-[hsl(var(--accent))]' : 'bg-[hsl(var(--primary))]'}`} />
        </div>
        <div className="space-y-3" style={{ fontFamily: 'var(--app-font-serif)' }}>
          <AnimatePresence initial={false}>
            {visibleActions.map((action) => (
              <BoardActionView key={`${action.id}-${actionIndex}`} action={action} dark={dark} />
            ))}
          </AnimatePresence>
        </div>
        {visibleActions.length === 0 && (
          <div className={`flex min-h-[220px] items-center justify-center text-center text-sm italic ${dark ? 'text-[hsl(40_33%_95%/.48)]' : 'text-[hsl(var(--muted-foreground))]'}`}>
            Your teacher is getting the first note ready…
          </div>
        )}
        <div className={`mt-10 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[.16em] ${dark ? 'text-[hsl(40_33%_95%/.44)]' : 'text-[hsl(var(--muted-foreground))]'}`}>
          <span className="h-px w-8 bg-current" /> {actionIndex < actions.length ? 'teacher is writing' : 'pause here and let it land'}
        </div>
      </motion.div>
    </div>
  );
}

function BoardActionView({ action, dark }: { action: BoardAction; dark: boolean }) {
  const base = dark ? 'text-[hsl(40_33%_95%/.92)]' : 'text-[hsl(var(--foreground))]';
  const muted = dark ? 'text-[hsl(40_33%_95%/.62)]' : 'text-[hsl(var(--muted-foreground))]';
  const mono = action.type === 'formula' || action.type === 'code' || action.type === 'graph' || action.type === 'table';

  if (action.type === 'highlight') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: .98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: .98 }}
        className={`rounded-xl border-l-4 px-4 py-3 text-[13px] font-semibold ${dark ? 'border-[hsl(29_79%_74%)] bg-[hsl(29_79%_74%/.12)]' : 'border-[hsl(var(--accent-foreground))] bg-[hsl(var(--accent)/.25)]'} ${base}`}
      >
        {action.content}
      </motion.div>
    );
  }

  if (action.type === 'underline') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={`inline-block border-b-2 border-dashed pb-1 text-[13px] font-semibold ${dark ? 'border-[hsl(29_79%_74%)]' : 'border-[hsl(var(--primary))]'} ${base}`}
      >
        {action.content}
      </motion.div>
    );
  }

  if (action.type === 'draw' || action.type === 'diagram' || action.type === 'flowchart') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        className={`rounded-xl border border-dashed p-4 text-center text-[15px] leading-8 ${dark ? 'border-[hsl(40_33%_95%/.3)] bg-[hsl(40_33%_95%/.05)]' : 'border-[hsl(var(--primary)/.3)] bg-[hsl(var(--secondary)/.55)]'} ${base}`}
      >
        {action.content}
      </motion.div>
    );
  }

  if (action.type === 'table' && action.rows) {
    return (
      <motion.table initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`w-full border-collapse text-left text-[12px] ${mono ? 'font-mono' : ''} ${base}`}>
        <tbody>
          {action.rows.map((row, rowIndex) => (
            <tr key={`${action.id}-${rowIndex}`}>
              {row.map((cell) => <td key={cell} className={`border px-3 py-2 ${dark ? 'border-[hsl(40_33%_95%/.2)]' : 'border-[hsl(var(--foreground)/.14)]'} ${rowIndex === 0 ? 'font-bold' : ''}`}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </motion.table>
    );
  }

  if (action.type === 'graph' && action.points) {
    const points = action.points.map(([x, y]) => `${x * 10},${100 - y * 10}`).join(' ');
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-xl p-2">
        <svg viewBox="0 0 100 100" className={`h-32 w-full ${dark ? 'text-[hsl(29_79%_74%)]' : 'text-[hsl(var(--primary))]'}`} role="img" aria-label={action.content ?? 'Teacher graph'}>
          <path d="M 8 8 V 92 H 96" fill="none" stroke="currentColor" strokeWidth="1" opacity=".45" />
          <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {action.content && <div className={`text-center text-[11px] ${muted}`}>{action.content}</div>}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={`whitespace-pre-wrap ${action.type === 'formula' ? 'text-[21px] font-semibold tracking-[-.02em]' : action.type === 'code' ? 'rounded-xl border p-4 text-[13px] leading-7' : 'text-[15px] leading-7'} ${action.type === 'code' ? (dark ? 'border-[hsl(40_33%_95%/.18)] bg-[hsl(40_33%_95%/.06)]' : 'border-[hsl(var(--foreground)/.14)] bg-[hsl(var(--secondary)/.55)]') : ''} ${action.type === 'formula' ? (dark ? 'text-[hsl(29_79%_74%)]' : 'text-[hsl(var(--primary))]') : base}`}
    >
      {action.content}
    </motion.div>
  );
}

function TeacherPanel({
  step,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSpeak,
  isSpeaking,
  speechSupported,
  onCheck,
  checkpointState,
  selectedOption,
  setSelectedOption,
  followUp,
  setFollowUp,
  followUpAnswer,
  onFollowUp,
}: {
  step: LessonStep;
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSpeak: () => void;
  isSpeaking: boolean;
  speechSupported: boolean;
  onCheck: () => void;
  checkpointState: CheckpointState;
  selectedOption: number | null;
  setSelectedOption: (value: number) => void;
  followUp: string;
  setFollowUp: (value: string) => void;
  followUpAnswer: string;
  onFollowUp: () => void;
}) {
  return (
    <div className="flex min-w-0 flex-col">
      <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">
        <div className="flex items-center gap-2"><div className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><GraduationCap size={15} /></div> Your teacher</div>
        <div className="font-mono tracking-[.08em]">{String(currentStep + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}</div>
      </div>
      <div className="rounded-[22px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/.7)] p-5 shadow-[0_12px_30px_hsl(164_31%_16%/.05)] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[hsl(var(--accent))] shadow-[0_0_0_5px_hsl(var(--accent)/.13)]" />
            <p className="text-[15px] leading-7 text-[hsl(var(--foreground)/.84)]">{step.teacherText}</p>
          </div>
          <button onClick={onSpeak} className={`soft-focus shrink-0 rounded-xl border p-2.5 transition ${isSpeaking ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent)/.14)] text-[hsl(var(--primary))]' : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/.45)] hover:text-[hsl(var(--primary))]'}`} aria-label={isSpeaking ? 'Stop voice playback' : 'Play teacher explanation'} data-testid="button-voice-playback">{isSpeaking ? <Pause size={16} /> : <Volume2 size={16} />}</button>
        </div>
        <div className="mt-6 rounded-2xl bg-[hsl(var(--secondary)/.58)] p-4">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]"><Lightbulb size={13} className="text-[hsl(var(--accent-foreground))]" /> Try picturing it</div>
          <p className="text-[13px] leading-6 text-[hsl(var(--foreground)/.76)]">{step.example}</p>
        </div>
        {!speechSupported && <div className="mt-3 text-[10px] text-[hsl(var(--muted-foreground))]">Voice playback is unavailable in this browser. The lesson works beautifully without it.</div>}
      </div>

      <LessonCheckpoint
        step={step}
        state={checkpointState}
        selectedOption={selectedOption}
        onSelect={setSelectedOption}
        onCheck={onCheck}
      />

      <div className="mt-5 rounded-[22px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/.5)] p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-bold"><Sparkles size={14} className="text-[hsl(var(--accent-foreground))]" /> Still wondering?</div>
        <div className="flex gap-2">
          <input value={followUp} onChange={(event) => setFollowUp(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && onFollowUp()} className="soft-focus min-w-0 flex-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background)/.55)] px-3.5 py-3 text-[12px] outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary)/.5)]" placeholder="Ask me to explain it another way..." data-testid="input-follow-up" />
          <button onClick={onFollowUp} disabled={!followUp.trim()} className="soft-focus rounded-xl bg-[hsl(var(--secondary))] px-3.5 text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--accent)/.35)] disabled:opacity-35" aria-label="Send follow-up question" data-testid="button-send-follow-up"><Send size={16} /></button>
        </div>
        {followUpAnswer && <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 border-l-2 border-[hsl(var(--accent))] pl-3 text-[12px] leading-5 text-[hsl(var(--muted-foreground))]" data-testid="text-follow-up-answer">{followUpAnswer}</motion.div>}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button onClick={onPrevious} disabled={currentStep === 0} className="soft-focus flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--foreground))] disabled:cursor-not-allowed disabled:opacity-35" data-testid="button-previous-step"><ChevronLeft size={16} /> Previous</button>
        <button onClick={onNext} className="soft-focus flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-[12px] font-bold text-[hsl(var(--primary-foreground))] shadow-[0_7px_16px_hsl(var(--primary)/.18)] transition hover:-translate-y-0.5" data-testid="button-next-step">{currentStep === totalSteps - 1 ? 'Finish lesson' : 'Next idea'} <ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

function PracticeView({
  lesson,
  selectedOption,
  practiceState,
  onSelect,
  onSubmit,
  onRecap,
}: {
  lesson: Lesson;
  selectedOption: number | null;
  practiceState: 'idle' | 'correct' | 'incorrect';
  onSelect: (index: number) => void;
  onSubmit: () => void;
  onRecap: () => void;
}) {
  const question = lesson.practice;
  const answered = practiceState !== 'idle';
  return (
    <motion.div
      key="practice"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-[900px]"
    >
      <div className="mb-7">
        <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--muted-foreground))]">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" /> Practice
        </div>
        <h1
          className="text-4xl font-semibold tracking-[-.06em] sm:text-6xl"
          style={{ fontFamily: 'var(--app-font-serif)' }}
        >
          Let’s try one together.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-7 text-[hsl(var(--muted-foreground))]">
          You have seen the idea. Now use it once without the teacher leading every step.
        </p>
      </div>

      <div className="rounded-[26px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/.72)] p-5 shadow-[0_20px_55px_hsl(164_31%_16%/.07)] sm:p-8">
        <div className="rounded-[20px] bg-[hsl(var(--secondary)/.7)] p-5 sm:p-7">
          <div className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">
            Small practice question
          </div>
          <h2 className="max-w-2xl text-xl font-bold leading-8 tracking-[-.03em] sm:text-2xl">
            {question.prompt}
          </h2>
        </div>

        <div className="mt-6 space-y-2.5">
          {question.options.map((option, index) => {
            const chosen = selectedOption === index;
            const correct = answered && index === question.correctOption;
            const wrong = practiceState === 'incorrect' && chosen;
            return (
              <button
                key={option}
                onClick={() => !answered && onSelect(index)}
                className={`soft-focus flex w-full items-center gap-3 rounded-xl border p-4 text-left text-[13px] font-semibold transition ${
                  correct
                    ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]'
                    : wrong
                      ? 'border-[hsl(var(--destructive)/.5)] bg-[hsl(var(--destructive)/.08)] text-[hsl(var(--destructive))]'
                      : chosen
                        ? 'border-[hsl(var(--primary)/.65)] bg-[hsl(var(--secondary))]'
                        : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/.4)] hover:bg-[hsl(var(--secondary)/.45)]'
                }`}
                data-testid={`button-practice-option-${index}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold">
                  {correct ? <Check size={14} /> : String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {practiceState === 'incorrect' && (
          <div className="mt-5 rounded-xl bg-[hsl(var(--secondary)/.8)] p-4 text-[12px] leading-6 text-[hsl(var(--foreground)/.8)]">
            That is a useful attempt. Look back at the board and notice the main pattern before you try the recap.
          </div>
        )}
        {practiceState === 'correct' && (
          <div className="mt-5 rounded-xl bg-[hsl(var(--primary)/.1)] p-4 text-[12px] leading-6 text-[hsl(var(--primary))]">
            <strong>Nicely done. </strong>
            {question.feedback}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          {!answered ? (
            <button
              disabled={selectedOption === null}
              onClick={onSubmit}
              className="soft-focus flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-3 text-[12px] font-bold text-[hsl(var(--primary-foreground))] shadow-[0_7px_16px_hsl(var(--primary)/.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35"
              data-testid="button-submit-practice"
            >
              Check my answer <ArrowRight size={15} />
            </button>
          ) : (
            <button
              onClick={onRecap}
              className="soft-focus flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-3 text-[12px] font-bold text-[hsl(var(--primary-foreground))] shadow-[0_7px_16px_hsl(var(--primary)/.18)] transition hover:-translate-y-0.5"
              data-testid="button-see-recap"
            >
              See the recap <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function LessonView({ lesson, setLesson, onRestart }: { lesson: Lesson; setLesson: (lesson: Lesson) => void; onRestart: () => void }) {
  const [boardMode, setBoardMode] = useState<'chalkboard' | 'whiteboard'>(lesson.steps[0].boardKind);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [checkpointState, setCheckpointState] = useState<CheckpointState>('idle');
  const [followUp, setFollowUp] = useState('');
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [practiceSelection, setPracticeSelection] = useState<number | null>(null);
  const [practiceState, setPracticeState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const current = lesson.steps[lesson.currentStep];
  useEffect(() => {
    setSelectedOption(null);
    setCheckpointState('idle');
    setFollowUpAnswer('');
    setBoardMode(current.boardKind);
    setPracticeSelection(null);
    setPracticeState('idle');
  }, [lesson.currentStep, current.boardKind]);
  useEffect(() => () => { if (speechSupported) window.speechSynthesis.cancel(); }, [speechSupported]);

  const toggleSpeech = () => {
    if (!speechSupported) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(current.teacherText);
    utterance.rate = .94;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };
  const checkAnswer = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === current.correctOption;
    if (correct) {
      setCheckpointState('correct');
    } else if (checkpointState === 'idle') {
      setCheckpointState('hint');
      setSelectedOption(null);
    } else {
      setCheckpointState('simplified');
    }
    setLesson({
      ...lesson,
      questionsAnswered: lesson.questionsAnswered + 1,
      learnedConcepts: correct && !lesson.learnedConcepts.includes(current.title)
        ? [...lesson.learnedConcepts, current.title]
        : lesson.learnedConcepts,
      weakAreas: !correct && !lesson.weakAreas.includes(current.title)
        ? [...lesson.weakAreas, current.title]
        : lesson.weakAreas,
    });
  };
  const next = () => {
    if (checkpointState !== 'correct' && checkpointState !== 'simplified') return;
    if (lesson.currentStep === lesson.steps.length - 1) {
      setLesson({ ...lesson, phase: 'practice', progress: 85 });
      return;
    }
    const nextStep = lesson.currentStep + 1;
    setLesson({
      ...lesson,
      currentStep: nextStep,
      progress: Math.round(((nextStep + 1) / lesson.steps.length) * 70),
    });
  };
  const previous = () => {
    if (lesson.currentStep === 0) return;
    const previousStep = lesson.currentStep - 1;
    setLesson({
      ...lesson,
      currentStep: previousStep,
      phase: 'teaching',
      progress: Math.round(((previousStep + 1) / lesson.steps.length) * 70),
    });
  };
  const sendFollowUp = () => {
    if (!followUp.trim()) return;
    setFollowUpAnswer(`Good question. Put simply: ${followUp.trim().replace(/[?!.]+$/, '')} is connected to the same core idea on the board. Look for what goes in, what changes, and what comes out. That three-part pattern will help you reason it through.`);
    setFollowUp('');
  };
  const submitPractice = () => {
    if (practiceSelection === null) return;
    const correct = practiceSelection === lesson.practice.correctOption;
    setPracticeState(correct ? 'correct' : 'incorrect');
    setLesson({
      ...lesson,
      questionsAnswered: lesson.questionsAnswered + 1,
      phase: 'practice',
    });
  };
  const showRecap = () => {
    if (practiceState === 'idle') return;
    setLesson({ ...lesson, phase: 'recap', progress: 100 });
  };
  const completed = lesson.phase === 'recap';
  return (
    <div className="classroom-shell noise min-h-[100dvh]">
      <header className="sticky top-0 z-30 border-b border-[hsl(var(--border)/.8)] bg-[hsl(var(--background)/.88)] backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-5"><LogoMark /><div className="hidden h-7 w-px bg-[hsl(var(--border))] sm:block" /><div className="hidden text-sm font-semibold text-[hsl(var(--muted-foreground))] sm:block">{lesson.topic}</div></div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 text-right sm:flex"><div className="font-mono text-[9px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">Lesson progress</div><div className="h-1.5 w-24 overflow-hidden rounded-full bg-[hsl(var(--secondary))]"><div className="h-full rounded-full bg-[hsl(var(--accent))] transition-all duration-500" style={{ width: `${lesson.progress}%` }} /></div><span className="font-mono text-[10px] font-bold">{lesson.progress}%</span></div>
            <button onClick={onRestart} className="soft-focus rounded-xl border border-[hsl(var(--border))] p-2.5 text-[hsl(var(--muted-foreground))] transition hover:border-[hsl(var(--primary)/.4)] hover:text-[hsl(var(--primary))]" aria-label="Start a different lesson" data-testid="button-change-lesson"><RotateCcw size={16} /></button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1500px]">
        <ProgressRail lesson={lesson} />
        <main className="min-w-0 flex-1 px-5 pb-14 pt-7 sm:px-8 lg:px-10 lg:pt-10">
          <AnimatePresence mode="wait">
            {completed ? (
              <motion.div key="complete" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-[1050px] rounded-[28px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/.75)] p-7 shadow-[0_20px_55px_hsl(164_31%_16%/.08)] sm:p-12">
                <div className="mx-auto max-w-2xl text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[hsl(var(--accent))] text-[hsl(var(--primary))] shadow-[6px_6px_0_hsl(var(--primary)/.13)]"><Check size={30} strokeWidth={2.5} /></div><div className="mt-7 font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--muted-foreground))]">Lesson complete</div><h1 className="mt-3 text-4xl font-semibold tracking-[-.06em] sm:text-6xl" style={{ fontFamily: 'var(--app-font-serif)' }}>That idea is yours now.</h1><p className="mx-auto mt-5 max-w-lg text-[15px] leading-7 text-[hsl(var(--muted-foreground))]">You walked through {lesson.topic} one careful step at a time. That is how understanding sticks.</p></div>
                <div className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-[hsl(var(--secondary)/.7)] p-4"><div className="font-mono text-2xl font-bold">{lesson.questionsAnswered}</div><div className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">checkpoints answered</div></div><div className="rounded-2xl bg-[hsl(var(--secondary)/.7)] p-4"><div className="font-mono text-2xl font-bold">{lesson.learnedConcepts.length}</div><div className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">ideas gathered</div></div><div className="rounded-2xl bg-[hsl(var(--secondary)/.7)] p-4"><div className="font-mono text-2xl font-bold">8 min</div><div className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">focused together</div></div></div>
                {lesson.weakAreas.length > 0 && <div className="mx-auto mt-5 max-w-2xl rounded-2xl bg-[hsl(var(--accent)/.14)] p-4 text-left text-[12px] leading-6 text-[hsl(var(--foreground)/.75)]"><strong className="text-[hsl(var(--primary))]">A note for next time: </strong>We slowed down around {lesson.weakAreas.join(', ')}. That is useful information, not a failure.</div>}
                <div className="mt-9 flex justify-center"><button onClick={onRestart} className="soft-focus flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-[hsl(var(--primary-foreground))]" data-testid="button-start-another">Teach me something else <ArrowRight size={16} /></button></div>
              </motion.div>
            ) : lesson.phase === 'practice' ? (
              <PracticeView lesson={lesson} selectedOption={practiceSelection} practiceState={practiceState} onSelect={setPracticeSelection} onSubmit={submitPractice} onRecap={showRecap} />
            ) : (
              <motion.div key={lesson.currentStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }} className="mx-auto max-w-[1200px]">
                <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                  <div><div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--muted-foreground))]"><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" /> Part {String(lesson.currentStep + 1).padStart(2, '0')}</div><h1 className="text-3xl font-semibold tracking-[-.055em] sm:text-[42px]" style={{ fontFamily: 'var(--app-font-serif)' }}>{current.title}</h1></div>
                  <div className="max-w-[250px] text-right text-[12px] leading-5 text-[hsl(var(--muted-foreground))]">Stay with the idea. There is no prize for rushing ahead.</div>
                </div>
                <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1.08fr)_minmax(380px,.92fr)] xl:gap-10">
                  <Board step={current} boardMode={boardMode} onToggle={setBoardMode} />
                  <TeacherPanel step={current} currentStep={lesson.currentStep} totalSteps={lesson.steps.length} onPrevious={previous} onNext={next} onSpeak={toggleSpeech} isSpeaking={isSpeaking} speechSupported={speechSupported} onCheck={checkAnswer} checkpointState={checkpointState} selectedOption={selectedOption} setSelectedOption={setSelectedOption} followUp={followUp} setFollowUp={setFollowUp} followUpAnswer={followUpAnswer} onFollowUp={sendFollowUp} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function Home() {
  const [setup, setSetup] = useState<TopicSetup>(defaultSetup);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const startLesson = () => {
    if (!setup.topic.trim()) return;
    setIsStarting(true);
    window.setTimeout(() => {
      setLesson(buildLesson(setup.topic));
      setIsStarting(false);
    }, 520);
  };
  return lesson ? <LessonView lesson={lesson} setLesson={setLesson} onRestart={() => setLesson(null)} /> : <SetupView setup={setup} setSetup={setSetup} onStart={startLesson} isStarting={isStarting} />;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route component={() => <div className="flex min-h-[100dvh] items-center justify-center bg-[hsl(var(--background))] p-8 text-center"><div><X className="mx-auto mb-4 text-[hsl(var(--destructive))]" /><h1 className="text-2xl font-bold">That page wandered off.</h1><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Return to the classroom to keep learning.</p></div></div>} /></Switch>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ErrorBoundary><Router /></ErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;