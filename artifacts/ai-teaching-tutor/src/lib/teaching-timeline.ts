import type { BoardAction, LessonStep } from '@/lib/lesson-engine';

export type TeacherPresentationState =
  | 'speaking'
  | 'explaining'
  | 'listening'
  | 'thinking'
  | 'asking'
  | 'waiting'
  | 'reacting'
  | 'encouraging'
  | 'looking';

export type TeachingTimelineEvent = {
  id: string;
  speech: string;
  state: TeacherPresentationState;
  boardActions: BoardAction[];
  durationMs: number;
};

export type TeachingTimeline = {
  events: TeachingTimelineEvent[];
};

const durationFor = (speech: string) => Math.max(2200, speech.length * 42);

const event = (
  id: string,
  speech: string,
  state: TeacherPresentationState,
  boardActions: BoardAction[],
): TeachingTimelineEvent => ({
  id,
  speech,
  state,
  boardActions,
  durationMs: durationFor(speech),
});

function binarySearchTimeline(step: LessonStep): TeachingTimeline {
  if (step.title === 'The shortcut through a sorted list') {
    return {
      events: [
        event(
          'binary-intro',
          'Today we are going to learn Binary Search.',
          'speaking',
          [{ id: 'binary-title', type: 'formula', content: 'BINARY SEARCH' }],
        ),
        event(
          'binary-fast',
          'It is a smart way to find one item quickly.',
          'explaining',
          [{ id: 'binary-definition', type: 'write', content: 'A fast way to find an item' }],
        ),
        event(
          'binary-rule',
          'But there is one important rule: the list must already be sorted.',
          'looking',
          [
            { id: 'binary-rule-note', type: 'highlight', content: 'RULE 01  •  The list must be sorted' },
            { id: 'binary-sorted-list', type: 'table', rows: [['10', '20', '30', '40', '50', '60', '70']] },
          ],
        ),
      ],
    };
  }

  if (step.title === 'Start in the middle') {
    return {
      events: [
        event(
          'binary-search-target',
          'Let’s search for 60 in our sorted list.',
          'speaking',
          [{ id: 'binary-search-list', type: 'diagram', content: '[10] [20] [30] [40] [50] [60] [70]' }],
        ),
        event(
          'binary-middle',
          'We check the middle element first. The middle is 40.',
          'looking',
          [{ id: 'binary-middle-note', type: 'highlight', content: 'middle = 40' }],
        ),
        event(
          'binary-compare',
          'Now we ask one small question: is 60 smaller or larger than 40?',
          'asking',
          [{ id: 'binary-compare-note', type: 'underline', content: '60 > 40  →  keep the right half' }],
        ),
      ],
    };
  }

  return {
    events: [
      event(
        'binary-right-half',
        'Now we have [50, 60, 70].',
        'speaking',
        [
          { id: 'binary-small-list', type: 'diagram', content: '[50] [60] [70]' },
          { id: 'binary-dim-left', type: 'highlight', content: 'Left half removed: 10, 20, 30, 40' },
        ],
      ),
      event(
        'binary-found',
        'The middle is 60, so we found our answer.',
        'looking',
        [{ id: 'binary-found-note', type: 'highlight', content: 'found 60' }],
      ),
      event(
        'binary-why-fast',
        'Each comparison cuts away a large part of the list. That is why Binary Search is fast.',
        'explaining',
        [{ id: 'binary-fast-note', type: 'graph', content: 'fewer choices after each check', points: [[1, 8], [2, 5], [3, 3], [4, 2]] }],
      ),
    ],
  };
}

function genericTimeline(step: LessonStep): TeachingTimeline {
  const actions = step.boardActions ?? [];
  const events = actions.map((action, index) => event(
    `${step.title}-timeline-${index}`,
    index === 0 ? step.teacherText : `Now notice this: ${action.content ?? 'the next visual step'}.`,
    index === actions.length - 1 ? 'explaining' : index % 2 === 0 ? 'speaking' : 'looking',
    [action],
  ));

  return {
    events: events.length > 0
      ? events
      : [event(`${step.title}-timeline`, step.teacherText, 'explaining', [])],
  };
}

export function buildTeachingTimeline(topic: string, step: LessonStep): TeachingTimeline {
  if (topic.toLowerCase().includes('binary search')) return binarySearchTimeline(step);
  return genericTimeline(step);
}

export function materializeBoardActions(events: TeachingTimelineEvent[]): BoardAction[] {
  const visible: BoardAction[] = [];
  for (const timelineEvent of events) {
    for (const action of timelineEvent.boardActions) {
      if (action.type === 'erase') {
        if (action.targetId) {
          for (let index = visible.length - 1; index >= 0; index -= 1) {
            if (visible[index].id === action.targetId) visible.splice(index, 1);
          }
        } else {
          visible.pop();
        }
      } else {
        visible.push(action);
      }
    }
  }
  return visible;
}