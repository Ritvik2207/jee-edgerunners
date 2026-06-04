export type Subject = "Mathematics" | "Physics" | "Chemistry";
export type ViewKey = "dashboard" | "planner" | "syllabus" | "error-book" | "mocks" | "settings";

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
};

export type StudyState = {
  hoursToday: number;
  plannerTasks: Record<string, string>;
  completedTopics: Record<string, boolean>;
  confidence: Record<string, number>;
  errorLogs: ErrorLog[];
  mockTests: MockTest[];
  scratchpad: string;
  sessionsToday: number;
  questionsSolved: number;
  streakDays: number;
};

export const subjects: Subject[] = ["Mathematics", "Physics", "Chemistry"];

export const subjectMeta: Record<Subject, { short: string; color: string; glow: string }> = {
  Mathematics: { short: "Maths", color: "#ff4f7b", glow: "rgba(255, 79, 123, 0.24)" },
  Physics: { short: "Physics", color: "#22d3ee", glow: "rgba(34, 211, 238, 0.24)" },
  Chemistry: { short: "Chemistry", color: "#b7ff3c", glow: "rgba(183, 255, 60, 0.2)" }
};

export const syllabusTopics: Topic[] = [
  { id: "math-complex-numbers", subject: "Mathematics", title: "Complex Numbers", unit: "Unit 1", track: "Algebra", priority: "High" },
  { id: "math-quadratic-equations", subject: "Mathematics", title: "Quadratic Equations", unit: "Unit 2", track: "Algebra", priority: "Foundation" },
  { id: "math-matrices", subject: "Mathematics", title: "Matrices and Determinants", unit: "Unit 3", track: "Algebra", priority: "Scoring" },
  { id: "math-limits", subject: "Mathematics", title: "Limits and Derivatives", unit: "Unit 4", track: "Calculus", priority: "Core" },
  { id: "math-integrals", subject: "Mathematics", title: "Integral Calculus", unit: "Unit 5", track: "Calculus", priority: "High" },
  { id: "physics-units", subject: "Physics", title: "Units and Measurements", unit: "Unit 1", track: "Mechanics", priority: "Foundation" },
  { id: "physics-kinematics", subject: "Physics", title: "Kinematics", unit: "Unit 2", track: "Mechanics", priority: "Core" },
  { id: "physics-laws", subject: "Physics", title: "Laws of Motion", unit: "Unit 3", track: "Mechanics", priority: "High" },
  { id: "physics-current", subject: "Physics", title: "Current Electricity", unit: "Unit 4", track: "Electro", priority: "Scoring" },
  { id: "physics-modern", subject: "Physics", title: "Modern Physics", unit: "Unit 5", track: "Modern", priority: "Scoring" },
  { id: "chem-mole", subject: "Chemistry", title: "Some Basic Concepts in Chemistry", unit: "Unit 1", track: "Physical", priority: "Foundation" },
  { id: "chem-bonding", subject: "Chemistry", title: "Chemical Bonding", unit: "Unit 2", track: "Inorganic", priority: "High" },
  { id: "chem-thermo", subject: "Chemistry", title: "Thermodynamics", unit: "Unit 3", track: "Physical", priority: "Core" },
  { id: "chem-equilibrium", subject: "Chemistry", title: "Equilibrium", unit: "Unit 4", track: "Physical", priority: "High" },
  { id: "chem-organic-basics", subject: "Chemistry", title: "Organic Chemistry Basics", unit: "Unit 5", track: "Organic", priority: "Core" }
];

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function seedState(): StudyState {
  return {
    hoursToday: 6.25,
    plannerTasks: {
      maths: "Complex Numbers and Quadratic Equations",
      physics: "Units and Measurements examples",
      chemistry: "Mole concept NCERT + problems",
      revision: "Formula notebook and mistake log"
    },
    completedTopics: {
      "math-complex-numbers": true,
      "math-quadratic-equations": true,
      "physics-units": true,
      "chem-mole": true
    },
    confidence: {
      "math-complex-numbers": 72,
      "math-quadratic-equations": 66,
      "physics-units": 61,
      "chem-mole": 70
    },
    errorLogs: [
      { id: "9f98789b-7753-4dd6-b43c-6d8994e0a001", subject: "Physics", topic: "Units and Measurements", reason: "Skipped dimensional check in final step.", date: todayKey(), resolved: false },
      { id: "9f98789b-7753-4dd6-b43c-6d8994e0a002", subject: "Chemistry", topic: "Mole Concept", reason: "Mixed molarity and normality in a hurry.", date: todayKey(), resolved: false }
    ],
    mockTests: [
      { id: "9f98789b-7753-4dd6-b43c-6d8994e0b001", name: "JEE Main Mock 15", date: "2026-05-12", physics: 76, chemistry: 58, math: 48 },
      { id: "9f98789b-7753-4dd6-b43c-6d8994e0b002", name: "Part Test 04", date: "2026-05-08", physics: 64, chemistry: 61, math: 44 }
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
  return syllabusTopics.find((topic) => topic.subject === subject && !state.completedTopics[topic.id])?.title || "Mixed PYQ revision";
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

export function practiceAccuracy(state: StudyState) {
  const latest = state.mockTests.at(-1);
  if (!latest) return 0;
  return Math.round((totalMockScore(latest) / 300) * 100);
}
