export type Subject = "Mathematics" | "Physics" | "Chemistry";
export type ViewKey = "dashboard" | "planner" | "syllabus" | "error-book" | "mocks" | "settings";
export type MistakeType = "Conceptual" | "Calculation" | "Silly Mistake" | "Time Pressure" | "Memory Gap";
export type RevisionStage = "1-day" | "7-day" | "21-day";

export type Topic = {
  id: string;
  subject: Subject;
  title: string;
  unit: string;
  track: string;
  priority: "Foundation" | "Core" | "Scoring" | "High";
};

export type ErrorLog = {
  id: string;
  subject: Subject;
  topic: string;
  reason: string;
  mistakeType: MistakeType;
  weakChapter: string;
  repeatCount: number;
  repairTask: string;
  date: string;
  resolved: boolean;
};

export type MockTest = {
  id: string;
  name: string;
  date: string;
  physics: number;
  chemistry: number;
  math: number;
  physicsAccuracy: number;
  chemistryAccuracy: number;
  mathAccuracy: number;
  physicsWeakChapter: string;
  chemistryWeakChapter: string;
  mathWeakChapter: string;
};

export type StudyState = {
  hoursToday: number;
  plannerTasks: Record<string, string>;
  completedTopics: Record<string, boolean>;
  completedAt: Record<string, string>;
  confidence: Record<string, number>;
  revisionDone: Record<string, boolean>;
  errorLogs: ErrorLog[];
  mockTests: MockTest[];
  scratchpad: string;
  sessionsToday: number;
  questionsSolved: number;
  streakDays: number;
  lastStudyDate: string;
};

export type RevisionItem = {
  id: string;
  topicId: string;
  topicTitle: string;
  subject: Subject;
  stage: RevisionStage;
  dueDate: string;
  completed: boolean;
  status: "overdue" | "today" | "upcoming";
};

export type StudyActionKind = "revision" | "mistake-repair" | "mock-repair";

export type StudyActionItem = {
  id: string;
  kind: StudyActionKind;
  title: string;
  detail: string;
  action: string;
  subject: Subject;
  dueDate: string;
  status: "overdue" | "today" | "upcoming";
  sourceLabel: string;
  completed: boolean;
  color: string;
  topicId?: string;
  errorId?: string;
  mockId?: string;
  revisionId?: string;
};

export type ChapterGuide = {
  formulas: string[];
  traps: string[];
  repairNotes: string[];
  guidance: string[];
};

export const subjects: Subject[] = ["Mathematics", "Physics", "Chemistry"];
export const mistakeTypes: MistakeType[] = ["Conceptual", "Calculation", "Silly Mistake", "Time Pressure", "Memory Gap"];

export const subjectMeta: Record<Subject, { short: string; color: string; glow: string }> = {
  Mathematics: { short: "Maths", color: "#ff4f7b", glow: "rgba(255, 79, 123, 0.24)" },
  Physics: { short: "Physics", color: "#22d3ee", glow: "rgba(34, 211, 238, 0.24)" },
  Chemistry: { short: "Chemistry", color: "#b7ff3c", glow: "rgba(183, 255, 60, 0.2)" }
};

export const syllabusTopics: Topic[] = [
  { id: "math-sets-relations", subject: "Mathematics", title: "Sets, Relations and Functions", unit: "Unit 1", track: "Algebra", priority: "Foundation" },
  { id: "math-complex-numbers", subject: "Mathematics", title: "Complex Numbers", unit: "Unit 2", track: "Algebra", priority: "High" },
  { id: "math-quadratic-equations", subject: "Mathematics", title: "Quadratic Equations", unit: "Unit 3", track: "Algebra", priority: "Foundation" },
  { id: "math-sequences-series", subject: "Mathematics", title: "Sequences and Series", unit: "Unit 4", track: "Algebra", priority: "Core" },
  { id: "math-binomial", subject: "Mathematics", title: "Binomial Theorem", unit: "Unit 5", track: "Algebra", priority: "Scoring" },
  { id: "math-permutation-combination", subject: "Mathematics", title: "Permutations and Combinations", unit: "Unit 6", track: "Algebra", priority: "Core" },
  { id: "math-matrices", subject: "Mathematics", title: "Matrices and Determinants", unit: "Unit 7", track: "Algebra", priority: "Scoring" },
  { id: "math-limits", subject: "Mathematics", title: "Limits and Derivatives", unit: "Unit 8", track: "Calculus", priority: "Core" },
  { id: "math-continuity-differentiability", subject: "Mathematics", title: "Continuity and Differentiability", unit: "Unit 9", track: "Calculus", priority: "High" },
  { id: "math-application-derivatives", subject: "Mathematics", title: "Application of Derivatives", unit: "Unit 10", track: "Calculus", priority: "Core" },
  { id: "math-integrals", subject: "Mathematics", title: "Integral Calculus", unit: "Unit 11", track: "Calculus", priority: "High" },
  { id: "math-differential-equations", subject: "Mathematics", title: "Differential Equations", unit: "Unit 12", track: "Calculus", priority: "Scoring" },
  { id: "math-coordinate-geometry", subject: "Mathematics", title: "Coordinate Geometry", unit: "Unit 13", track: "Geometry", priority: "High" },
  { id: "math-vectors-3d", subject: "Mathematics", title: "Vector Algebra and 3D Geometry", unit: "Unit 14", track: "Geometry", priority: "Scoring" },
  { id: "math-trigonometry", subject: "Mathematics", title: "Trigonometry", unit: "Unit 15", track: "Geometry", priority: "Core" },
  { id: "math-probability-statistics", subject: "Mathematics", title: "Probability and Statistics", unit: "Unit 16", track: "Probability", priority: "Scoring" },

  { id: "physics-units", subject: "Physics", title: "Units and Measurements", unit: "Unit 1", track: "Mechanics", priority: "Foundation" },
  { id: "physics-kinematics", subject: "Physics", title: "Kinematics", unit: "Unit 2", track: "Mechanics", priority: "Core" },
  { id: "physics-laws", subject: "Physics", title: "Laws of Motion", unit: "Unit 3", track: "Mechanics", priority: "High" },
  { id: "physics-work-energy", subject: "Physics", title: "Work, Energy and Power", unit: "Unit 4", track: "Mechanics", priority: "Core" },
  { id: "physics-rotational-motion", subject: "Physics", title: "Rotational Motion", unit: "Unit 5", track: "Mechanics", priority: "High" },
  { id: "physics-gravitation", subject: "Physics", title: "Gravitation", unit: "Unit 6", track: "Mechanics", priority: "Core" },
  { id: "physics-properties-matter", subject: "Physics", title: "Properties of Solids and Fluids", unit: "Unit 7", track: "Mechanics", priority: "Core" },
  { id: "physics-thermodynamics", subject: "Physics", title: "Thermodynamics", unit: "Unit 8", track: "Heat", priority: "High" },
  { id: "physics-kinetic-theory", subject: "Physics", title: "Kinetic Theory of Gases", unit: "Unit 9", track: "Heat", priority: "Scoring" },
  { id: "physics-oscillations-waves", subject: "Physics", title: "Oscillations and Waves", unit: "Unit 10", track: "Waves", priority: "Core" },
  { id: "physics-electrostatics", subject: "Physics", title: "Electrostatics", unit: "Unit 11", track: "Electro", priority: "High" },
  { id: "physics-current", subject: "Physics", title: "Current Electricity", unit: "Unit 12", track: "Electro", priority: "Scoring" },
  { id: "physics-magnetism", subject: "Physics", title: "Magnetic Effects of Current", unit: "Unit 13", track: "Electro", priority: "High" },
  { id: "physics-emi-ac", subject: "Physics", title: "EMI and Alternating Current", unit: "Unit 14", track: "Electro", priority: "Core" },
  { id: "physics-optics", subject: "Physics", title: "Optics", unit: "Unit 15", track: "Optics", priority: "High" },
  { id: "physics-modern", subject: "Physics", title: "Modern Physics", unit: "Unit 16", track: "Modern", priority: "Scoring" },

  { id: "chem-mole", subject: "Chemistry", title: "Some Basic Concepts in Chemistry", unit: "Unit 1", track: "Physical", priority: "Foundation" },
  { id: "chem-atomic-structure", subject: "Chemistry", title: "Atomic Structure", unit: "Unit 2", track: "Physical", priority: "Core" },
  { id: "chem-periodic-table", subject: "Chemistry", title: "Classification and Periodicity", unit: "Unit 3", track: "Inorganic", priority: "Foundation" },
  { id: "chem-bonding", subject: "Chemistry", title: "Chemical Bonding", unit: "Unit 4", track: "Inorganic", priority: "High" },
  { id: "chem-states-matter", subject: "Chemistry", title: "States of Matter", unit: "Unit 5", track: "Physical", priority: "Core" },
  { id: "chem-thermo", subject: "Chemistry", title: "Thermodynamics", unit: "Unit 6", track: "Physical", priority: "Core" },
  { id: "chem-equilibrium", subject: "Chemistry", title: "Equilibrium", unit: "Unit 7", track: "Physical", priority: "High" },
  { id: "chem-redox", subject: "Chemistry", title: "Redox Reactions", unit: "Unit 8", track: "Physical", priority: "Scoring" },
  { id: "chem-electrochemistry", subject: "Chemistry", title: "Electrochemistry", unit: "Unit 9", track: "Physical", priority: "High" },
  { id: "chem-chemical-kinetics", subject: "Chemistry", title: "Chemical Kinetics", unit: "Unit 10", track: "Physical", priority: "Scoring" },
  { id: "chem-solutions", subject: "Chemistry", title: "Solutions", unit: "Unit 11", track: "Physical", priority: "Core" },
  { id: "chem-coordination", subject: "Chemistry", title: "Coordination Compounds", unit: "Unit 12", track: "Inorganic", priority: "High" },
  { id: "chem-organic-basics", subject: "Chemistry", title: "Organic Chemistry Basics", unit: "Unit 13", track: "Organic", priority: "Core" },
  { id: "chem-hydrocarbons", subject: "Chemistry", title: "Hydrocarbons", unit: "Unit 14", track: "Organic", priority: "Core" },
  { id: "chem-goc", subject: "Chemistry", title: "General Organic Chemistry", unit: "Unit 15", track: "Organic", priority: "High" },
  { id: "chem-biomolecules", subject: "Chemistry", title: "Biomolecules and Polymers", unit: "Unit 16", track: "Organic", priority: "Scoring" }
];

export function todayKey() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function addDays(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function revisionTaskKey(topicId: string, stage: RevisionStage) {
  return `${topicId}:${stage}`;
}

const revisionStages: Array<{ stage: RevisionStage; days: number }> = [
  { stage: "1-day", days: 1 },
  { stage: "7-day", days: 7 },
  { stage: "21-day", days: 21 }
];

export function buildRevisionItems(state: StudyState): RevisionItem[] {
  const today = todayKey();

  return syllabusTopics
    .filter((topic) => state.completedTopics[topic.id])
    .flatMap((topic) => {
      const completedDate = state.completedAt[topic.id] || today;
      return revisionStages.map(({ stage, days }) => {
        const dueDate = addDays(completedDate, days);
        const completed = Boolean(state.revisionDone[revisionTaskKey(topic.id, stage)]);
        const status: RevisionItem["status"] = dueDate < today ? "overdue" : dueDate === today ? "today" : "upcoming";
        return {
          id: revisionTaskKey(topic.id, stage),
          topicId: topic.id,
          topicTitle: topic.title,
          subject: topic.subject,
          stage,
          dueDate,
          completed,
          status
        };
      });
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
}

function actionStatus(dueDate: string): StudyActionItem["status"] {
  const today = todayKey();
  if (dueDate < today) return "overdue";
  if (dueDate === today) return "today";
  return "upcoming";
}

function safeDateKey(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : todayKey();
}

function normalizedChapter(value: string) {
  return value.trim().toLowerCase();
}

function matchingMockRepair(state: StudyState, mock: MockTest, subject: Subject, weakChapter: string) {
  const chapter = normalizedChapter(weakChapter);
  const mockName = mock.name.trim().toLowerCase();

  return state.errorLogs.find((entry) => {
    if (entry.subject !== subject) return false;
    if (normalizedChapter(entry.weakChapter || entry.topic) !== chapter) return false;
    return entry.reason.toLowerCase().includes(mockName);
  });
}

export function buildStudyActions(state: StudyState): StudyActionItem[] {
  const revisionActions: StudyActionItem[] = buildRevisionItems(state).map((item) => ({
    id: `revision:${item.id}`,
    kind: "revision",
    title: `${item.stage} revision`,
    detail: item.topicTitle,
    action: "Active recall first, then solve a short mixed set and update confidence.",
    subject: item.subject,
    dueDate: item.dueDate,
    status: item.status,
    sourceLabel: "Syllabus completion",
    completed: item.completed,
    color: subjectMeta[item.subject].color,
    topicId: item.topicId,
    revisionId: item.id
  }));

  const mistakeActions: StudyActionItem[] = state.errorLogs
    .filter((entry) => !entry.resolved)
    .map((entry) => {
      const dueDate = safeDateKey(entry.date);
      return {
        id: `mistake:${entry.id}`,
        kind: "mistake-repair",
        title: `Repair ${entry.weakChapter || entry.topic}`,
        detail: `${entry.mistakeType} mistake, repeated ${entry.repeatCount}x`,
        action: entry.repairTask || `Repair ${entry.topic} with three examples and one correction note.`,
        subject: entry.subject,
        dueDate,
        status: actionStatus(dueDate),
        sourceLabel: "Error Book",
        completed: false,
        color: subjectMeta[entry.subject].color,
        errorId: entry.id
      };
    });

  const mockActions: StudyActionItem[] = state.mockTests.flatMap((mock) => (
    subjects.flatMap((subject) => {
      const weakChapter = subjectWeakChapter(mock, subject).trim();
      if (!weakChapter) return [];

      const existingRepair = matchingMockRepair(state, mock, subject, weakChapter);
      if (existingRepair && !existingRepair.resolved) return [];

      const score = subjectScore(mock, subject);
      const accuracy = subjectAccuracy(mock, subject);
      const dueDate = addDays(safeDateKey(mock.date), 1);

      return [{
        id: `mock:${mock.id}:${subject}`,
        kind: "mock-repair" as const,
        title: `Mock repair: ${weakChapter}`,
        detail: `${mock.name} | ${score}/100, ${accuracy}% accuracy`,
        action: `Repair ${weakChapter}: revise the trap list, solve 15 targeted questions, and log every miss.`,
        subject,
        dueDate,
        status: actionStatus(dueDate),
        sourceLabel: "Mock weak chapter",
        completed: Boolean(existingRepair?.resolved),
        color: subjectMeta[subject].color,
        mockId: mock.id
      }];
    })
  ));

  const statusRank: Record<StudyActionItem["status"], number> = { overdue: 0, today: 1, upcoming: 2 };
  const kindRank: Record<StudyActionKind, number> = { "mistake-repair": 0, "mock-repair": 1, revision: 2 };

  return [...mistakeActions, ...mockActions, ...revisionActions].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return kindRank[a.kind] - kindRank[b.kind] || statusRank[a.status] - statusRank[b.status] || a.dueDate.localeCompare(b.dueDate);
  });
}

function baseChapterGuide(topic: Topic): ChapterGuide {
  const subjectBase: Record<Subject, ChapterGuide> = {
    Mathematics: {
      formulas: [
        `Build a one-page formula card for ${topic.title} with definitions, conditions, and standard transformations.`,
        "Keep one solved example beside each formula family so the usage is clear."
      ],
      traps: [
        "Applying a formula without checking its condition.",
        "Skipping algebra sign checks in the final two steps."
      ],
      repairNotes: [
        "Redo two wrong examples slowly and write the exact step where the method broke.",
        "Solve a short mixed set after the repair note so the chapter is tested under switching pressure."
      ],
      guidance: [
        "Keep this chapter guide original and exam-safe: use your own notes, NCERT/official syllabus wording, and self-written examples.",
        `For ${topic.track}, focus on recognition first, then speed. Speed should come after the method is reliable.`
      ]
    },
    Physics: {
      formulas: [
        `Write the key ${topic.title} formulas with units, symbol meaning, and limiting cases.`,
        "Add one line for when each formula is valid so you do not use it outside its assumptions."
      ],
      traps: [
        "Forgetting units or dimensions while substituting numbers.",
        "Using a memorized result without checking the physical condition."
      ],
      repairNotes: [
        "Redo one conceptual miss and one numerical miss, then write what assumption was hidden.",
        "Make a trap list for units, signs, diagrams, and approximation mistakes."
      ],
      guidance: [
        "Use public-syllabus-safe language: concepts, formula conditions, and your own examples. Do not copy paid question solutions.",
        `For ${topic.track}, draw the situation before calculation whenever possible.`
      ]
    },
    Chemistry: {
      formulas: [
        `Keep ${topic.title} formulas, reactions, or key facts in small recall cards.`,
        "Add conditions, exceptions, and units beside each item instead of only listing final results."
      ],
      traps: [
        "Mixing similar terms because the condition or exception was not written.",
        "Reading a line as memory work when it actually needs a small concept check."
      ],
      repairNotes: [
        "Write the wrong assumption, the correct rule, and one fresh self-made example.",
        "After repair, do a quick recall pass without opening notes."
      ],
      guidance: [
        "Keep Chemistry notes original and reference-safe: summarize concepts in your own words and avoid copied coaching sheets.",
        `For ${topic.track}, separate memory facts from calculation or mechanism steps.`
      ]
    }
  };

  return subjectBase[topic.subject];
}

const chapterGuideOverrides: Record<string, Partial<ChapterGuide>> = {
  "math-complex-numbers": {
    formulas: [
      "i^2 = -1; keep powers of i reduced before expanding.",
      "For z = a + bi, track modulus, argument, conjugate, and geometry separately.",
      "Use |z1 z2| = |z1||z2| and arg(z1 z2) = arg z1 + arg z2 only after checking quadrant."
    ],
    traps: [
      "Changing the quadrant while simplifying argument.",
      "Treating conjugate signs casually in division.",
      "Mixing algebra form and polar form without converting fully."
    ]
  },
  "math-integrals": {
    formulas: [
      "Keep standard integrals, substitution triggers, partial fractions, and definite integral properties on separate lines.",
      "Write the condition beside each property before using it."
    ],
    traps: [
      "Forgetting constant of integration in indefinite questions.",
      "Choosing a substitution because it looks familiar instead of because it simplifies the expression."
    ]
  },
  "physics-units": {
    formulas: [
      "Write SI base units and common derived dimensions in one compact table.",
      "For dimensional analysis, compare dimensions before substituting numbers."
    ],
    traps: [
      "Skipping unit conversion before calculation.",
      "Assuming a formula is correct because the numbers look reasonable."
    ]
  },
  "physics-rotational-motion": {
    formulas: [
      "Keep torque, angular momentum, moment of inertia, and energy relations in one map.",
      "Write the axis and sign convention before using rotational equations."
    ],
    traps: [
      "Using point-mass inertia when the body shape matters.",
      "Mixing linear and angular variables without the radius relation."
    ]
  },
  "chem-mole": {
    formulas: [
      "Keep mole, mass, molarity, molality, normality, and limiting reagent relations separated.",
      "Write units beside concentration formulas every time."
    ],
    traps: [
      "Mixing molarity and normality.",
      "Ignoring the limiting reagent after finding moles."
    ]
  },
  "chem-equilibrium": {
    formulas: [
      "Keep Kc, Kp, reaction quotient, degree of dissociation, and pH-related relations in separate groups.",
      "Write the reaction direction before interpreting Q versus K."
    ],
    traps: [
      "Changing coefficients without adjusting the equilibrium constant.",
      "Confusing ionic equilibrium assumptions with chemical equilibrium setup."
    ]
  }
};

export function chapterGuideForTopic(topic: Topic): ChapterGuide {
  const base = baseChapterGuide(topic);
  const override = chapterGuideOverrides[topic.id] || {};

  return {
    formulas: override.formulas || base.formulas,
    traps: override.traps || base.traps,
    repairNotes: override.repairNotes || base.repairNotes,
    guidance: override.guidance || base.guidance
  };
}

export function seedState(): StudyState {
  const today = todayKey();
  const completedAt = {
    "math-complex-numbers": addDays(today, -21),
    "math-quadratic-equations": addDays(today, -7),
    "physics-units": addDays(today, -2),
    "chem-mole": addDays(today, -1)
  };

  return {
    hoursToday: 6.25,
    plannerTasks: {},
    completedTopics: {
      "math-complex-numbers": true,
      "math-quadratic-equations": true,
      "physics-units": true,
      "chem-mole": true
    },
    completedAt,
    revisionDone: {
      [revisionTaskKey("math-complex-numbers", "1-day")]: true,
      [revisionTaskKey("math-quadratic-equations", "1-day")]: true
    },
    confidence: {
      "math-complex-numbers": 72,
      "math-quadratic-equations": 66,
      "physics-units": 61,
      "chem-mole": 70
    },
    errorLogs: [
      {
        id: "9f98789b-7753-4dd6-b43c-6d8994e0a001",
        subject: "Physics",
        topic: "Units and Measurements",
        weakChapter: "Units and Measurements",
        mistakeType: "Conceptual",
        repeatCount: 2,
        repairTask: "Redo dimensional analysis examples and write two unit traps.",
        reason: "Skipped dimensional check in final step.",
        date: today,
        resolved: false
      },
      {
        id: "9f98789b-7753-4dd6-b43c-6d8994e0a002",
        subject: "Chemistry",
        topic: "Mole Concept",
        weakChapter: "Some Basic Concepts in Chemistry",
        mistakeType: "Calculation",
        repeatCount: 1,
        repairTask: "Practice 12 mole conversion questions without calculator shortcuts.",
        reason: "Mixed molarity and normality in a hurry.",
        date: today,
        resolved: false
      }
    ],
    mockTests: [
      {
        id: "9f98789b-7753-4dd6-b43c-6d8994e0b001",
        name: "JEE Main Mock 15",
        date: "2026-05-12",
        physics: 76,
        chemistry: 58,
        math: 48,
        physicsAccuracy: 82,
        chemistryAccuracy: 70,
        mathAccuracy: 61,
        physicsWeakChapter: "Optics",
        chemistryWeakChapter: "Equilibrium",
        mathWeakChapter: "Integral Calculus"
      },
      {
        id: "9f98789b-7753-4dd6-b43c-6d8994e0b002",
        name: "Part Test 04",
        date: "2026-05-08",
        physics: 64,
        chemistry: 61,
        math: 44,
        physicsAccuracy: 74,
        chemistryAccuracy: 72,
        mathAccuracy: 58,
        physicsWeakChapter: "Rotational Motion",
        chemistryWeakChapter: "Chemical Bonding",
        mathWeakChapter: "Coordinate Geometry"
      }
    ],
    scratchpad: "# Quick scratchpad\ns = ut + 1/2 at^2\nv^2 = u^2 + 2as\n\nlog rules:\nlog(ab) = loga + logb",
    sessionsToday: 4,
    questionsSolved: 0,
    streakDays: 1,
    lastStudyDate: today
  };
}

export function markStudyActivity(state: StudyState, activityDate = todayKey()): StudyState {
  if (state.lastStudyDate === activityDate) return state;

  const yesterday = addDays(activityDate, -1);
  return {
    ...state,
    streakDays: state.lastStudyDate === yesterday ? state.streakDays + 1 : 1,
    lastStudyDate: activityDate
  };
}

export function subjectProgress(state: StudyState, subject: Subject) {
  const topics = syllabusTopics.filter((topic) => topic.subject === subject);
  const done = topics.filter((topic) => state.completedTopics[topic.id]).length;
  return {
    done,
    total: topics.length,
    percent: Math.round((done / topics.length) * 100)
  };
}

export function nextTopic(state: StudyState, subject: Subject) {
  const priorityScore: Record<Topic["priority"], number> = { High: 4, Core: 3, Scoring: 2, Foundation: 1 };
  return syllabusTopics
    .filter((topic) => topic.subject === subject && !state.completedTopics[topic.id])
    .sort((a, b) => {
      const confidenceA = state.confidence[a.id] ?? 0;
      const confidenceB = state.confidence[b.id] ?? 0;
      return priorityScore[b.priority] - priorityScore[a.priority] || confidenceA - confidenceB;
    })[0]?.title || "Mixed PYQ revision";
}

export function topicById(topicId: string) {
  return syllabusTopics.find((topic) => topic.id === topicId);
}

export function formatHours(hours: number) {
  const minutes = Math.round(hours * 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function totalMockScore(mock: MockTest) {
  return mock.physics + mock.chemistry + mock.math;
}

export function subjectScore(mock: MockTest, subject: Subject) {
  if (subject === "Physics") return mock.physics;
  if (subject === "Chemistry") return mock.chemistry;
  return mock.math;
}

export function subjectAccuracy(mock: MockTest, subject: Subject) {
  if (subject === "Physics") return mock.physicsAccuracy;
  if (subject === "Chemistry") return mock.chemistryAccuracy;
  return mock.mathAccuracy;
}

export function subjectWeakChapter(mock: MockTest, subject: Subject) {
  if (subject === "Physics") return mock.physicsWeakChapter;
  if (subject === "Chemistry") return mock.chemistryWeakChapter;
  return mock.mathWeakChapter;
}

export function weakestMockSubject(state: StudyState) {
  const latest = state.mockTests.at(-1);
  if (!latest) return undefined;

  return subjects
    .map((subject) => ({
      subject,
      score: subjectScore(latest, subject),
      accuracy: subjectAccuracy(latest, subject)
    }))
    .sort((a, b) => a.score + a.accuracy * 0.4 - (b.score + b.accuracy * 0.4))[0];
}

export function practiceAccuracy(state: StudyState) {
  const latest = state.mockTests.at(-1);
  if (!latest) return 0;
  return Math.round((latest.physicsAccuracy + latest.chemistryAccuracy + latest.mathAccuracy) / 3);
}
