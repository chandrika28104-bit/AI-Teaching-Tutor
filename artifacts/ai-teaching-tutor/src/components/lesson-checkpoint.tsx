import { ArrowRight, Check, CircleHelp, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import type { LessonStep } from '@/lib/lesson-engine';

export type CheckpointState = 'idle' | 'hint' | 'correct' | 'simplified';

type LessonCheckpointProps = {
  step: LessonStep;
  state: CheckpointState;
  selectedOption: number | null;
  onSelect: (index: number) => void;
  onCheck: () => void;
};

export function LessonCheckpoint({
  step,
  state,
  selectedOption,
  onSelect,
  onCheck,
}: LessonCheckpointProps) {
  const resolved = state === 'correct' || state === 'simplified';
  const canCheck = selectedOption !== null && !resolved;

  return (
    <div
      className="mt-5 rounded-[22px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/.62)] p-5 sm:p-7"
      data-testid="checkpoint-card"
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-xl bg-[hsl(var(--accent)/.2)] p-2 text-[hsl(var(--primary))]">
          <CircleHelp size={18} />
        </div>
        <div>
          <div className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">
            Quick checkpoint
          </div>
          <h3 className="mt-1 text-[16px] font-bold tracking-[-.02em]">{step.question}</h3>
          <p className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">
            {state === 'hint'
              ? 'Try once more. Use the hint, then choose an answer.'
              : resolved
                ? 'Good work. Take the next idea when you are ready.'
                : 'It is okay to think out loud. Choose the answer that feels closest.'}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {step.options.map((option, index) => {
          const isChosen = selectedOption === index;
          const isRight = state === 'correct' && index === step.correctOption;
          const isWrong = state === 'hint' && isChosen;
          return (
            <button
              key={option}
              onClick={() => !resolved && onSelect(index)}
              className={`soft-focus flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-[13px] font-medium transition ${
                isRight
                  ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]'
                  : isWrong
                    ? 'border-[hsl(var(--destructive)/.5)] bg-[hsl(var(--destructive)/.08)] text-[hsl(var(--destructive))]'
                    : isChosen
                      ? 'border-[hsl(var(--primary)/.65)] bg-[hsl(var(--secondary))]'
                      : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/.4)] hover:bg-[hsl(var(--secondary)/.45)]'
              }`}
              data-testid={`button-option-${index}`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                  isRight
                    ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : isWrong
                      ? 'border-[hsl(var(--destructive))]'
                      : 'border-[hsl(var(--border))]'
                }`}
              >
                {isRight ? <Check size={13} /> : String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {state === 'hint' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl bg-[hsl(var(--accent)/.16)] p-3 text-[12px] leading-5 text-[hsl(var(--foreground)/.8)]"
          data-testid="text-checkpoint-hint"
        >
          <div className="mb-1 flex items-center gap-2 font-bold text-[hsl(var(--primary))]">
            <Lightbulb size={14} /> Small hint
          </div>
          {step.hint}
        </motion.div>
      )}

      {state === 'correct' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl bg-[hsl(var(--primary)/.1)] p-3 text-[12px] leading-5 text-[hsl(var(--primary))]"
          data-testid="text-checkpoint-feedback"
        >
          <strong>Correct. </strong>
          {step.feedback}
        </motion.div>
      )}

      {state === 'simplified' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl bg-[hsl(var(--secondary)/.8)] p-3 text-[12px] leading-5 text-[hsl(var(--foreground)/.8)]"
          data-testid="text-checkpoint-feedback"
        >
          <strong>Let’s make it simpler. </strong>
          {step.simplerExplanation}
        </motion.div>
      )}

      {canCheck && (
        <button
          onClick={onCheck}
          className="soft-focus mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--foreground))] py-3 text-[12px] font-bold text-[hsl(var(--background))] transition hover:bg-[hsl(var(--primary))]"
          data-testid="button-check-answer"
        >
          {state === 'hint' ? 'Try again' : 'Check my thinking'} <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}