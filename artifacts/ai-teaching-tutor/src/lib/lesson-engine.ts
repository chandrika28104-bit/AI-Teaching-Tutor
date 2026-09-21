export type TopicSetup = {
  topic: string;
  level: string;
  goal: string;
  style: string;
};

export type LessonPhase = 'teaching' | 'practice' | 'recap';

export type BoardActionType =
  | 'write'
  | 'erase'
  | 'highlight'
  | 'underline'
  | 'draw'
  | 'formula'
  | 'diagram'
  | 'graph'
  | 'table'
  | 'flowchart'
  | 'code';

export type BoardAction = {
  id: string;
  type: BoardActionType;
  content?: string;
  targetId?: string;
  rows?: string[][];
  points?: [number, number][];
};

export type LessonStep = {
  title: string;
  teacherText: string;
  boardContent: string;
  boardKind: 'chalkboard' | 'whiteboard';
  boardActions?: BoardAction[];
  example: string;
  question: string;
  options: string[];
  correctOption: number;
  hint: string;
  simplerExplanation: string;
  feedback: string;
};

export type PracticeQuestion = {
  prompt: string;
  options: string[];
  correctOption: number;
  feedback: string;
};

export type Lesson = {
  topic: string;
  steps: LessonStep[];
  practice: PracticeQuestion;
  currentStep: number;
  phase: LessonPhase;
  progress: number;
  learnedConcepts: string[];
  questionsAnswered: number;
  weakAreas: string[];
};

export const defaultSetup: TopicSetup = {
  topic: 'Binary Search',
  level: 'Curious beginner',
  goal: 'Understand the big picture',
  style: 'Patient & visual',
};

const photosynthesisSteps: LessonStep[] = [
  {
    title: 'The quiet work of a leaf',
    teacherText:
      'Let’s start with the why. A plant cannot walk to a grocery store, so it makes its own food. Photosynthesis is the process that turns light energy into stored food. The leaf is the plant’s little solar kitchen.',
    boardContent:
      'PHOTOSYNTHESIS\nlight energy  →  stored food\n\nWhere it happens\n• Mostly in the leaves\n• Inside chloroplasts',
    boardKind: 'chalkboard',
    example:
      'Picture a sunlit windowsill. The plant is not eating the sunlight. It is capturing that energy and putting it into sugar.',
    question: 'What is the main job of photosynthesis?',
    options: [
      'To make food using light energy',
      'To absorb oxygen from the air',
      'To cool the plant on hot days',
    ],
    correctOption: 0,
    hint: 'Look at the first line on the board. What does the plant make?',
    simplerExplanation:
      'Photosynthesis means a plant uses light to make food. Light goes in, and stored food comes out.',
    feedback:
      'Exactly. Photosynthesis stores light energy in food, giving the plant a usable source of energy.',
  },
  {
    title: 'The ingredients arrive',
    teacherText:
      'Every recipe needs ingredients. For photosynthesis, the plant takes in carbon dioxide through tiny openings in its leaves, and water travels upward from the roots. Sunlight provides the energy to rearrange them.',
    boardContent:
      'THE RECIPE\n\n6 CO₂  +  6 H₂O  +  light\n            ↓\n      C₆H₁₂O₆  +  6 O₂\n\ncarbon dioxide + water → glucose + oxygen',
    boardKind: 'whiteboard',
    example:
      'Think of carbon dioxide as the carbon-rich flour and water as the liquid. Sunlight is the energy that helps the recipe happen.',
    question: 'Which two materials does the plant use to make glucose?',
    options: ['Carbon dioxide and water', 'Oxygen and soil', 'Sunlight and oxygen'],
    correctOption: 0,
    hint: 'The board shows two ingredients before the arrow. Sunlight powers the recipe, but it is not a material.',
    simplerExplanation:
      'The plant uses carbon dioxide from the air and water from the ground. Light gives the plant energy to combine them.',
    feedback:
      'Yes. Carbon dioxide and water are the raw materials. Light powers the transformation.',
  },
  {
    title: 'Chlorophyll catches the light',
    teacherText:
      'Now meet chlorophyll, the green pigment inside chloroplasts. It absorbs some colors of light and reflects more green light back to our eyes. That reflected green is why many leaves look green.',
    boardContent:
      'CHLOROPHYLL\n\ncaptures → light energy\nreflects  → green light\n\nchloroplast = the cell’s\nsunlight-catching room',
    boardKind: 'chalkboard',
    example:
      'It is like a set of tiny solar panels. They do not absorb every color equally; green light is the color that bounces back most noticeably.',
    question: 'Why do many leaves appear green?',
    options: ['Chlorophyll reflects green light', 'Leaves create green oxygen', 'Water turns the leaf green'],
    correctOption: 0,
    hint: 'Check the second arrow on the board. Which color does chlorophyll send back to our eyes?',
    simplerExplanation:
      'Chlorophyll catches some light but sends green light back. That is the green color we see.',
    feedback:
      'That’s it. Chlorophyll absorbs some light and reflects green wavelengths into our eyes.',
  },
  {
    title: 'A useful exchange',
    teacherText:
      'The final exchange is beautifully practical. The plant keeps glucose as food or uses it to grow. Oxygen is released as a byproduct through the leaf. The process feeds the plant while refreshing the air around it.',
    boardContent:
      'THE PAYOFF\n\nplant keeps → glucose\nplant releases → oxygen\n\nlight in  •  food made  •  air refreshed',
    boardKind: 'whiteboard',
    example:
      'A tree can turn a beam of afternoon light into new leaves, new roots, and new rings in its trunk. Stored sunlight becomes structure.',
    question: 'What happens to the oxygen made during photosynthesis?',
    options: [
      'Much of it is released into the air',
      'It becomes the plant’s roots',
      'It disappears inside the soil',
    ],
    correctOption: 0,
    hint: 'Look at the “plant releases” line. The oxygen does not stay locked inside the plant.',
    simplerExplanation:
      'The plant uses the food it makes. Extra oxygen leaves the plant and goes into the air.',
    feedback:
      'Right. Oxygen is released into the surrounding air, while the plant uses or stores the glucose.',
  },
];

const binarySearchSteps: LessonStep[] = [
  {
    title: 'The shortcut through a sorted list',
    teacherText:
      'Today we are learning Binary Search. It is a smart way to find one item quickly. But it has one important rule: the list must already be sorted.',
    boardContent:
      'BINARY SEARCH\n\nA fast way to find an item\n\nRULE 01\nThe list must be sorted\n\n[10, 20, 30, 40, 50, 60, 70]',
    boardKind: 'chalkboard',
    example:
      'Think about finding a name in a dictionary. You do not start at page one. You open near the middle and use the alphabet to choose a half.',
    question: 'What must be true before Binary Search can work correctly?',
    options: ['The list must be sorted', 'The list must have 100 items', 'Every item must be a word'],
    correctOption: 0,
    hint: 'The first rule is written in large letters on the board.',
    simplerExplanation:
      'Binary Search needs order. If the numbers are mixed up, we cannot safely throw away half of the list.',
    feedback:
      'Correct. Sorting gives us the information we need to remove half of the search space.',
  },
  {
    title: 'Start in the middle',
    teacherText:
      'Let’s search for 60 in our sorted list. We look at the middle number first. The middle is 40. Now we ask one small question: is 60 smaller or larger than 40?',
    boardContent:
      '[10, 20, 30, 40, 50, 60, 70]\n                  ↑\n             middle = 40\n\n60 is larger than 40',
    boardKind: 'whiteboard',
    example:
      'If a book is alphabetized and your word comes after the middle word, the answer cannot be on the left side.',
    question: 'When searching for 60, what should we learn from comparing it with 40?',
    options: ['60 is larger, so search the right half', '60 is smaller, so search the left half', 'The whole list must be searched again'],
    correctOption: 0,
    hint: 'Numbers grow from left to right. Which side contains numbers bigger than 40?',
    simplerExplanation:
      'Because 60 is bigger than 40, we only keep the right half. We can forget about 10, 20, and 30.',
    feedback:
      'Exactly. One comparison lets us discard the entire left half.',
  },
  {
    title: 'Keep cutting the problem',
    teacherText:
      'Now we have [50, 60, 70]. The middle is 60, so we found our answer. Each comparison cuts away a large part of the list. That is why Binary Search is much faster than checking every item one by one.',
    boardContent:
      '[50, 60, 70]\n      ↑\n   found 60\n\nEach turn → keep one half\nFast search → fewer checks',
    boardKind: 'chalkboard',
    example:
      'Searching one million sorted names can take about 20 middle checks. Looking from the beginning could take one million checks.',
    question: 'Why is Binary Search usually fast?',
    options: ['It removes half the choices after each check', 'It always guesses the answer', 'It changes the list into random order'],
    correctOption: 0,
    hint: 'Notice what happened after we compared 60 and 40. How many choices did we throw away?',
    simplerExplanation:
      'Binary Search keeps one half and throws away the other half. A smaller problem is easier to solve.',
    feedback:
      'Yes. Cutting the search space in half again and again is the key idea.',
  },
];

const pythonFunctionSteps: LessonStep[] = [
  {
    title: 'A named recipe',
    teacherText:
      'A function is a named group of instructions. We write the instructions once, then call the function whenever we need that job again.',
    boardContent:
      'FUNCTION\n\nA named recipe for a job\n\n def greet():\n     print("Hello")',
    boardKind: 'chalkboard',
    example:
      'A coffee machine has a repeatable recipe. Press one button and it performs many small steps for you.',
    question: 'What is a function useful for?',
    options: ['Grouping instructions for a reusable job', 'Making the computer run without instructions', 'Storing only pictures'],
    correctOption: 0,
    hint: 'Think about the word reusable. Do we want to write the same recipe every time?',
    simplerExplanation:
      'A function is a small recipe with a name. Calling the name runs the recipe.',
    feedback:
      'Right. Functions package steps into a reusable job.',
  },
  {
    title: 'Inputs make a recipe flexible',
    teacherText:
      'A function can receive an input. We call that input a parameter. The same function can then work with different values.',
    boardContent:
      'INPUT → FUNCTION → OUTPUT\n\n def double(number):\n     return number * 2\n\ndouble(4) → 8',
    boardKind: 'whiteboard',
    example:
      'A blender can use different fruit while keeping the same blending process. The fruit is the input.',
    question: 'What is a parameter?',
    options: ['A value a function receives', 'The name of the computer', 'A comment the computer ignores'],
    correctOption: 0,
    hint: 'Look at the word inside the parentheses after the function name.',
    simplerExplanation:
      'A parameter is a place where a function receives a value so it can work with that value.',
    feedback:
      'Exactly. Parameters let the same function work with many inputs.',
  },
  {
    title: 'A result can come back',
    teacherText:
      'A function may send a result back with return. That makes the function useful inside a larger calculation.',
    boardContent:
      'RETURN = SEND A RESULT BACK\n\n def add(a, b):\n     return a + b\n\nanswer = add(2, 3)\nanswer → 5',
    boardKind: 'chalkboard',
    example:
      'Ordering a drink is a function call. You give an order, and the counter gives a finished drink back.',
    question: 'What does return do in a function?',
    options: ['Sends a result back to the caller', 'Deletes the function', 'Repeats the code forever'],
    correctOption: 0,
    hint: 'The board says “send a result back.”',
    simplerExplanation:
      'Return hands the answer from the function back to the code that called it.',
    feedback:
      'Yes. Return makes the function hand its result back so we can use it.',
  },
];

const equationSteps: LessonStep[] = [
  {
    title: 'Meet the equation',
    teacherText:
      'Let’s solve this one carefully. Our goal is to get x by itself. We will make one small change at a time, and we will do the same thing to both sides.',
    boardContent: '2x + 5 = 15',
    boardKind: 'chalkboard',
    boardActions: [
      { id: 'equation-start', type: 'formula', content: '2x + 5 = 15' },
      { id: 'equation-goal', type: 'highlight', content: 'Goal: get x alone' },
    ],
    example:
      'Think of the equation like a balanced scale. If you change one side, make the same change to the other side.',
    question: 'What is our goal when solving 2x + 5 = 15?',
    options: ['Get x by itself', 'Make 5 bigger', 'Remove the equal sign'],
    correctOption: 0,
    hint: 'Look at the highlighted goal on the board.',
    simplerExplanation:
      'We want to know the value of x. So we slowly remove the extra steps around x.',
    feedback: 'Correct. Solving means finding the value that makes the equation true.',
  },
  {
    title: 'Undo the addition',
    teacherText:
      'The 5 is added to 2x. Addition is undone by subtraction, so we subtract 5 from both sides. The board now shows the simpler equation that remains.',
    boardContent: '2x = 10',
    boardKind: 'whiteboard',
    boardActions: [
      { id: 'equation-original', type: 'formula', content: '2x + 5 = 15' },
      { id: 'equation-subtract', type: 'underline', content: 'subtract 5 from both sides' },
      { id: 'equation-after-subtract', type: 'erase', targetId: 'equation-original' },
      { id: 'equation-middle', type: 'formula', content: '2x = 10' },
    ],
    example:
      'If a box has 5 stickers added to it and you want the original number, take the 5 stickers away from both sides of the comparison.',
    question: 'What should we do to undo +5?',
    options: ['Subtract 5 from both sides', 'Add 5 only to the left side', 'Divide by 5'],
    correctOption: 0,
    hint: 'Use the opposite operation. The board just wrote it below the equation.',
    simplerExplanation:
      'Plus 5 is undone by minus 5. We subtract on both sides to keep the equation balanced.',
    feedback: 'Exactly. Subtracting 5 leaves us with 2x = 10.',
  },
  {
    title: 'Undo the multiplication',
    teacherText:
      'Now 2 is multiplying x. We undo multiplication by dividing both sides by 2. That leaves x alone, and we can read the answer from the board.',
    boardContent: 'x = 5',
    boardKind: 'chalkboard',
    boardActions: [
      { id: 'equation-middle-final', type: 'formula', content: '2x = 10' },
      { id: 'equation-divide', type: 'draw', content: 'divide both sides by 2' },
      { id: 'equation-middle-final', type: 'erase', targetId: 'equation-middle-final' },
      { id: 'equation-answer', type: 'formula', content: 'x = 5' },
      { id: 'equation-answer-highlight', type: 'highlight', content: 'Answer: x = 5' },
    ],
    example:
      'Two identical boxes hold 10 items altogether. Divide 10 into two equal groups to learn that each box holds 5.',
    question: 'What is the final value of x?',
    options: ['5', '10', '2'],
    correctOption: 0,
    hint: 'The last board line shows the answer after dividing 10 by 2.',
    simplerExplanation:
      'Two times x is 10. Half of 10 is 5, so x must be 5.',
    feedback: 'Yes. Dividing both sides by 2 gives x = 5.',
  },
];

const fallbackSteps = (topic: string): LessonStep[] => [
  {
    title: `Name the idea: ${topic}`,
    teacherText:
      `Let’s begin with ${topic}. We will keep the lesson small: first name the idea, then notice what goes in, what happens, and what comes out. You do not need to know everything at once.`,
    boardContent: `${topic.toUpperCase()}\n\nSTART WITH THREE QUESTIONS\n\n1. What is it?\n2. What does it do?\n3. Where might we see it?`,
    boardKind: 'chalkboard',
    example: `Imagine explaining ${topic} to a curious friend using one everyday example. Start with the job it does, not a difficult definition.`,
    question: `What is the best first move when learning ${topic}?`,
    options: ['Find the central idea', 'Memorize every detail immediately', 'Skip the example'],
    correctOption: 0,
    hint: 'The board asks us to start with the main idea.',
    simplerExplanation: `First, say what ${topic} is and what job it does. Details can come after the foundation.`,
    feedback: 'Good. A clear central idea gives the rest of the lesson somewhere to attach.',
  },
  {
    title: 'Look for the moving parts',
    teacherText:
      `Now let’s look at ${topic} as a simple process. Most ideas become easier when we can point to an input, a change, and an output.`,
    boardContent: `THE SIMPLE PATTERN\n\nINPUT  →  CHANGE  →  OUTPUT\n\nAsk: what goes in?\nAsk: what changes?\nAsk: what comes out?`,
    boardKind: 'whiteboard',
    example: `Like a toaster: bread goes in, heat changes it, and toast comes out. Use the same questions to explore ${topic}.`,
    question: 'Which pattern helps us explain a process clearly?',
    options: ['Input → change → output', 'Random detail → random detail', 'Output → no explanation'],
    correctOption: 0,
    hint: 'Read the large pattern in the middle of the board.',
    simplerExplanation: 'Find what enters, what happens to it, and what result leaves. That is the process.',
    feedback: 'Exactly. A process becomes easier to follow when its parts have a clear order.',
  },
  {
    title: 'Connect it to a real situation',
    teacherText:
      `Let’s make ${topic} useful. If you can connect an idea to a real situation, you are not just repeating words — you are starting to understand it.`,
    boardContent: `MAKE IT REAL\n\n${topic.toUpperCase()}\n↓\nOne everyday situation\n↓\nWhat would you predict?`,
    boardKind: 'chalkboard',
    example: `Choose a familiar situation and ask what ${topic} would help you predict, explain, or decide.`,
    question: 'What usually makes a difficult idea easier to remember?',
    options: ['A clear example connected to real life', 'More difficult words', 'Skipping the explanation'],
    correctOption: 0,
    hint: 'Think about what you can picture and explain to another person.',
    simplerExplanation: 'A real example gives the abstract idea something concrete to hold on to.',
    feedback: 'Yes. Examples turn an abstract idea into something you can picture and use.',
  },
];

const practiceFor = (topic: string): PracticeQuestion => {
  const lower = topic.toLowerCase();
  if (lower.includes('binary search')) {
    return {
      prompt: 'Your list is [2, 5, 8, 12, 18]. You are looking for 2. After checking the middle, which half should you keep?',
      options: ['The left half', 'The right half', 'Both halves'],
      correctOption: 0,
      feedback: 'Correct. Because 2 is smaller than the middle value, keep the left half.',
    };
  }
  if (lower.includes('function') || lower.includes('python')) {
    return {
      prompt: 'Which part of a function lets it hand an answer back to the code that called it?',
      options: ['return', 'print only', 'the function name'],
      correctOption: 0,
      feedback: 'Correct. return sends the result back so other code can use it.',
    };
  }
  if (lower.includes('photosynthesis') || lower.includes('plant')) {
    return {
      prompt: 'Which simple sentence best describes photosynthesis?',
      options: ['Plants use light to make food', 'Plants eat soil for energy', 'Plants turn oxygen into sunlight'],
      correctOption: 0,
      feedback: 'Correct. Plants use light energy to help make their food.',
    };
  }
  if (lower.includes('equation') || lower.includes('algebra') || lower.includes('math')) {
    return {
      prompt: 'If 3x = 12, what should you do first to find x?',
      options: ['Divide both sides by 3', 'Add 3 to both sides', 'Multiply both sides by 3'],
      correctOption: 0,
      feedback: 'Correct. Dividing both sides by 3 leaves x = 4.',
    };
  }
  return {
    prompt: `Which question would help you keep learning about ${topic}?`,
    options: ['What does it do in a real situation?', 'How can I skip the example?', 'Why should I memorize it without meaning?'],
    correctOption: 0,
    feedback: `Exactly. Asking what ${topic} does in a real situation is a strong next step.`,
  };
};

export function buildLesson(topic: string): Lesson {
  const cleanTopic = topic.trim() || 'Binary Search';
  const lower = cleanTopic.toLowerCase();
  const steps = lower.includes('binary search')
    ? binarySearchSteps
    : lower.includes('photosynthesis') || lower.includes('plant')
      ? photosynthesisSteps
      : lower.includes('function') || lower.includes('python')
        ? pythonFunctionSteps
        : lower.includes('equation') || lower.includes('algebra') || lower.includes('math')
          ? equationSteps
        : fallbackSteps(cleanTopic);
  const visualSteps = steps.map((step) => ({
    ...step,
    boardActions: step.boardActions ?? boardActionsFromText(step.boardContent, cleanTopic),
  }));

  return {
    topic: cleanTopic,
    steps: visualSteps,
    practice: practiceFor(cleanTopic),
    currentStep: 0,
    phase: 'teaching',
    progress: Math.round(25 / steps.length),
    learnedConcepts: [],
    questionsAnswered: 0,
    weakAreas: [],
  };
}

function boardActionsFromText(content: string, topic: string): BoardAction[] {
  const lowerTopic = topic.toLowerCase();
  const isCodeTopic =
    lowerTopic.includes('python') ||
    lowerTopic.includes('program') ||
    lowerTopic.includes('code') ||
    lowerTopic.includes('function');
  const isHistoryTopic = lowerTopic.includes('history') || lowerTopic.includes('war') || lowerTopic.includes('timeline');
  const isDiagramTopic =
    lowerTopic.includes('biology') ||
    lowerTopic.includes('plant') ||
    lowerTopic.includes('photosynthesis') ||
    lowerTopic.includes('physics') ||
    lowerTopic.includes('anatomy') ||
    lowerTopic.includes('ai') ||
    lowerTopic.includes('machine learning') ||
    lowerTopic.includes('neural');

  return content
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line, index) => {
      const trimmed = line.trim();
      const type: BoardActionType = isCodeTopic && (
        trimmed.includes('def ') ||
        trimmed.includes('return ') ||
        trimmed.includes('print(') ||
        trimmed.includes(' = ')
      )
        ? 'code'
        : isHistoryTopic && (trimmed.includes('→') || trimmed.includes('↓'))
          ? 'flowchart'
          : isDiagramTopic && (trimmed.includes('→') || trimmed.includes('↓') || trimmed.includes('INPUT'))
            ? 'diagram'
            : trimmed.includes('=') || trimmed.includes('→')
              ? 'formula'
              : trimmed.startsWith('•') || trimmed.toLowerCase().includes('rule')
                ? 'highlight'
                : 'write';
      return {
        id: `board-line-${index}`,
        type,
        content: trimmed,
      };
    });
}