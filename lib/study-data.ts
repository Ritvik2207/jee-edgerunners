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
    questionsSolved: 126,
    streakDays: 12
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
