import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
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
  VolumeX,
  WandSparkles,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';

type TopicSetup = {
  topic: string;
  level: string;
  goal: string;
  style: string;
};

type LessonStep = {
  title: string;
  teacherText: string;
  boardContent: string;
  boardKind: 'chalkboard' | 'whiteboard';
  example: string;
  question: string;
  options: string[];
  correctOption: number;
  feedback: string;
};

type Lesson = {
  topic: string;
  steps: LessonStep[];
  currentStep: number;
  progress: number;
  learnedConcepts: string[];
  questionsAnswered: number;
  weakAreas: string[];
};

const queryClient = new QueryClient();

const defaultSetup: TopicSetup = {
  topic: 'Photosynthesis',
  level: 'Curious beginner',
  goal: 'Understand the big picture',
  style: 'Patient & visual',
};

const seededSteps: LessonStep[] = [
  {
    title: 'The quiet work of a leaf',
    teacherText:
      'Let’s start with the why. A plant cannot walk to a grocery store, so it makes its own food. Photosynthesis is the elegant process that turns light energy into stored chemical energy. The leaf is the plant’s little solar kitchen.',
    boardContent: 'PHOTOSYNTHESIS\nlight energy  →  stored food\n\nWhere it happens\n• Mostly in the leaves\n• Inside chloroplasts',
    boardKind: 'chalkboard',
    example:
      'Picture a sunlit windowsill. The plant is not “eating” the sunlight — it is capturing that energy and putting it into the bonds of a sugar molecule.',
    question: 'What is the main job of photosynthesis?',
    options: ['To make food using light energy', 'To absorb oxygen from the air', 'To cool the plant on hot days'],
    correctOption: 0,
    feedback:
      'Exactly. Photosynthesis stores light energy in food, giving the plant a usable source of energy.',
  },
  {
    title: 'The ingredients arrive',
    teacherText:
      'Every recipe needs ingredients. For photosynthesis, the plant takes in carbon dioxide through tiny openings in its leaves, and water travels upward from the roots. Sunlight provides the energy to rearrange them.',
    boardContent: 'THE RECIPE\n\n6 CO₂  +  6 H₂O  +  light\n            ↓\n      C₆H₁₂O₆  +  6 O₂\n\ncarbon dioxide + water → glucose + oxygen',
    boardKind: 'whiteboard',
    example:
      'Think of carbon dioxide as the carbon-rich flour and water as the liquid. Sunlight is the heat and chef’s energy that helps the recipe happen.',
    question: 'Which two materials does the plant use to make glucose?',
    options: ['Carbon dioxide and water', 'Oxygen and soil', 'Sunlight and oxygen'],
    correctOption: 0,
    feedback:
      'Yes. Carbon dioxide and water are the raw materials. Light powers the transformation.',
  },
  {
    title: 'Chlorophyll catches the light',
    teacherText:
      'Now meet chlorophyll, the green pigment inside chloroplasts. It absorbs particular wavelengths of light and reflects more green light back to our eyes. That reflected green is why many leaves look green.',
    boardContent: 'CHLOROPHYLL\n\ncaptures → light energy\nreflects  → green light\n\nchloroplast = the cell’s\nsunlight-catching room',
    boardKind: 'chalkboard',
    example:
      'It is like a set of tiny, perfectly placed solar panels. They do not absorb every color equally; the green light is the color that bounces back most noticeably.',
    question: 'Why do many leaves appear green?',
    options: ['Chlorophyll reflects green light', 'Leaves create green oxygen', 'Water turns the leaf green'],
    correctOption: 0,
    feedback:
      'That’s it. Chlorophyll absorbs some light and reflects green wavelengths into our eyes.',
  },
  {
    title: 'A useful exchange',
    teacherText:
      'The final exchange is beautifully practical. The plant keeps glucose as food or uses it to grow. Oxygen is released as a byproduct through the leaf. So the process feeds the plant while quietly replenishing the air around it.',
    boardContent: 'THE PAYOFF\n\nplant keeps → glucose\nplant releases → oxygen\n\nlight in  •  food made  •  air refreshed',
    boardKind: 'whiteboard',
    example:
      'A tree can turn a beam of afternoon light into new leaves, new roots, and new rings in its trunk. That is stored sunlight becoming structure.',
    question: 'What happens to the oxygen made during photosynthesis?',
    options: ['Much of it is released into the air', 'It becomes the plant’s roots', 'It disappears inside the soil'],
    correctOption: 0,
    feedback:
      'Right. Oxygen is released into the surrounding air, while the plant uses or stores the glucose.',
  },
];

function buildLesson(topic: string): Lesson {
  const cleanTopic = topic.trim() || 'Photosynthesis';
  return {
    topic: cleanTopic,
    steps: seededSteps.map((step, index) =>
      index === 0 && cleanTopic.toLowerCase() !== 'photosynthesis'
        ? {
            ...step,
            title: `A clear beginning: ${cleanTopic}`,
            teacherText: `We’ll use the same patient, step-by-step rhythm to explore ${cleanTopic}. First, we’ll name the central idea, then connect it to an example you can picture. For today, the board is our shared place to think.`,
          }
        : step,
    ),
    currentStep: 0,
    progress: 25,
    learnedConcepts: [],
    questionsAnswered: 0,
    weakAreas: [],
  };
}

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

function Board({ step, boardMode, onToggle }: { step: LessonStep; boardMode: 'chalkboard' | 'whiteboard'; onToggle: (mode: 'chalkboard' | 'whiteboard') => void }) {
  const lines = step.boardContent.split('\n');
  const dark = boardMode === 'chalkboard';
  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]"><PencilLine size={14} /> On the board</div>
        <div className="flex rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.6)] p-1">
          {(['chalkboard', 'whiteboard'] as const).map((mode) => (
            <button key={mode} onClick={() => onToggle(mode)} className={`soft-focus rounded-lg px-2.5 py-1.5 text-[10px] font-bold capitalize transition ${boardMode === mode ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`} data-testid={`button-board-${mode}`}>{mode === 'chalkboard' ? 'Chalk' : 'White'}</button>
          ))}
        </div>
      </div>
      <motion.div layout className={`min-h-[320px] rounded-[22px] p-7 sm:min-h-[370px] sm:p-10 ${dark ? 'chalkboard text-[hsl(40_33%_95%/.92)]' : 'whiteboard text-[hsl(var(--foreground))]'}`} data-testid="board-content">
        <div className={`mb-9 flex items-center justify-between border-b pb-4 ${dark ? 'border-[hsl(40_33%_98%/.16)]' : 'border-[hsl(var(--foreground)/.14)]'}`}>
          <span className={`font-mono text-[9px] uppercase tracking-[.2em] ${dark ? 'text-[hsl(29_79%_74%)]' : 'text-[hsl(var(--primary))]'}`}>{dark ? 'chalk notes / 01' : 'working notes / 01'}</span>
          <span className={`h-2 w-2 rounded-full ${dark ? 'bg-[hsl(var(--accent))]' : 'bg-[hsl(var(--primary))]'}`} />
        </div>
        <div className="space-y-2" style={{ fontFamily: 'var(--app-font-serif)' }}>
          {lines.map((line, index) => (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .055 }} key={`${line}-${index}`} className={`whitespace-pre-wrap ${index === 0 ? 'mb-5 text-[19px] font-semibold tracking-[-.02em]' : line.includes('→') || line.includes('=') ? 'text-[15px] font-semibold' : 'text-[15px] leading-7'} ${line.startsWith('•') ? (dark ? 'text-[hsl(40_33%_95%/.65)]' : 'text-[hsl(var(--muted-foreground))]') : ''}`}>{line || '\u00a0'}</motion.div>
          ))}
        </div>
        <div className={`mt-10 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[.16em] ${dark ? 'text-[hsl(40_33%_95%/.44)]' : 'text-[hsl(var(--muted-foreground))]'}`}><span className="h-px w-8 bg-current" /> pause here and let it land</div>
      </motion.div>
    </div>
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
  onAnswer,
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
  onAnswer: () => void;
  checkpointState: 'idle' | 'correct' | 'incorrect';
  selectedOption: number | null;
  setSelectedOption: (value: number) => void;
  followUp: string;
  setFollowUp: (value: string) => void;
  followUpAnswer: string;
  onFollowUp: () => void;
}) {
  const answered = checkpointState !== 'idle';
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

      <div className="mt-5 rounded-[22px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/.62)] p-5 sm:p-7" data-testid="checkpoint-card">
        <div className="mb-5 flex items-start gap-3">
          <div className="rounded-xl bg-[hsl(var(--accent)/.2)] p-2 text-[hsl(var(--primary))]"><CircleHelp size={18} /></div>
          <div><div className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">Quick checkpoint</div><h3 className="mt-1 text-[16px] font-bold tracking-[-.02em]">{step.question}</h3></div>
        </div>
        <div className="space-y-2.5">
          {step.options.map((option, index) => {
            const isChosen = selectedOption === index;
            const isRight = answered && index === step.correctOption;
            const isWrong = answered && isChosen && index !== step.correctOption;
            return (
              <button key={option} onClick={() => !answered && setSelectedOption(index)} className={`soft-focus flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-[13px] font-medium transition ${isRight ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]' : isWrong ? 'border-[hsl(var(--destructive)/.5)] bg-[hsl(var(--destructive)/.08)] text-[hsl(var(--destructive))]' : isChosen ? 'border-[hsl(var(--primary)/.65)] bg-[hsl(var(--secondary))]' : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/.4)] hover:bg-[hsl(var(--secondary)/.45)]'}`} data-testid={`button-option-${index}`}>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${isRight ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : isWrong ? 'border-[hsl(var(--destructive))]' : 'border-[hsl(var(--border))]'}`}>{isRight ? <Check size={13} /> : String.fromCharCode(65 + index)}</span>{option}
              </button>
            );
          })}
        </div>
        {answered && <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 rounded-xl p-3 text-[12px] leading-5 ${checkpointState === 'correct' ? 'bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]' : 'bg-[hsl(var(--destructive)/.08)] text-[hsl(var(--destructive))]'}`} data-testid="text-checkpoint-feedback">{checkpointState === 'correct' ? step.feedback : `Not quite yet. ${step.feedback}`}</motion.div>}
        {!answered && <button disabled={selectedOption === null} onClick={onAnswer} className="soft-focus mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--foreground))] py-3 text-[12px] font-bold text-[hsl(var(--background))] transition hover:bg-[hsl(var(--primary))] disabled:cursor-not-allowed disabled:opacity-35" data-testid="button-check-answer">Check my thinking <ArrowRight size={15} /></button>}
      </div>

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

function LessonView({ lesson, setLesson, onRestart }: { lesson: Lesson; setLesson: (lesson: Lesson) => void; onRestart: () => void }) {
  const [boardMode, setBoardMode] = useState<'chalkboard' | 'whiteboard'>(lesson.steps[0].boardKind);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [checkpointState, setCheckpointState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [followUp, setFollowUp] = useState('');
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const current = lesson.steps[lesson.currentStep];
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  useEffect(() => {
    setSelectedOption(null);
    setCheckpointState('idle');
    setFollowUpAnswer('');
    setBoardMode(current.boardKind);
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
    speechRef.current = utterance;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };
  const answer = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === current.correctOption;
    setCheckpointState(correct ? 'correct' : 'incorrect');
    setLesson({
      ...lesson,
      questionsAnswered: lesson.questionsAnswered + 1,
      learnedConcepts: correct && !lesson.learnedConcepts.includes(current.title) ? [...lesson.learnedConcepts, current.title] : lesson.learnedConcepts,
      weakAreas: !correct && !lesson.weakAreas.includes(current.title) ? [...lesson.weakAreas, current.title] : lesson.weakAreas,
    });
  };
  const next = () => {
    if (lesson.currentStep === lesson.steps.length - 1) {
      setLesson({ ...lesson, progress: 100 });
      return;
    }
    const nextStep = lesson.currentStep + 1;
    setLesson({ ...lesson, currentStep: nextStep, progress: Math.round(((nextStep + 1) / lesson.steps.length) * 100) });
  };
  const previous = () => {
    if (lesson.currentStep === 0) return;
    const previousStep = lesson.currentStep - 1;
    setLesson({ ...lesson, currentStep: previousStep, progress: Math.round(((previousStep + 1) / lesson.steps.length) * 100) });
  };
  const sendFollowUp = () => {
    if (!followUp.trim()) return;
    setFollowUpAnswer(`Good question. Put simply: ${followUp.trim().replace(/[?!.]+$/, '')} is connected to the same core idea on the board. Look for what goes in, what changes, and what comes out. That three-part pattern will help you reason it through.`);
    setFollowUp('');
  };
  const completed = lesson.progress === 100 && lesson.currentStep === lesson.steps.length - 1;
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
                <div className="mt-9 flex justify-center"><button onClick={onRestart} className="soft-focus flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-[hsl(var(--primary-foreground))]" data-testid="button-start-another">Teach me something else <ArrowRight size={16} /></button></div>
              </motion.div>
            ) : (
              <motion.div key={lesson.currentStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }} className="mx-auto max-w-[1200px]">
                <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                  <div><div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--muted-foreground))]"><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" /> Part {String(lesson.currentStep + 1).padStart(2, '0')}</div><h1 className="text-3xl font-semibold tracking-[-.055em] sm:text-[42px]" style={{ fontFamily: 'var(--app-font-serif)' }}>{current.title}</h1></div>
                  <div className="max-w-[250px] text-right text-[12px] leading-5 text-[hsl(var(--muted-foreground))]">Stay with the idea. There is no prize for rushing ahead.</div>
                </div>
                <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1.08fr)_minmax(380px,.92fr)] xl:gap-10">
                  <Board step={current} boardMode={boardMode} onToggle={setBoardMode} />
                  <TeacherPanel step={current} currentStep={lesson.currentStep} totalSteps={lesson.steps.length} onPrevious={previous} onNext={next} onSpeak={toggleSpeech} isSpeaking={isSpeaking} speechSupported={speechSupported} onAnswer={answer} checkpointState={checkpointState} selectedOption={selectedOption} setSelectedOption={setSelectedOption} followUp={followUp} setFollowUp={setFollowUp} followUpAnswer={followUpAnswer} onFollowUp={sendFollowUp} />
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