import { mistakeTypes, seedState, todayKey, type ErrorLog, type MockTest, type StudyState } from "@/lib/study-data";

const stateKey = "edgerunners-webapp-state-v1";

export function readLocalState(): StudyState {
  if (typeof window === "undefined") return seedState();
  try {
    return normalizeState(JSON.parse(window.localStorage.getItem(stateKey) || ""));
  } catch {
    const seeded = seedState();
    writeLocalState(seeded);
    return seeded;
  }
}

export function writeLocalState(state: StudyState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(stateKey, JSON.stringify(state));
}

export function hasLegacyProgress() {
  if (typeof window === "undefined") return false;
  return [
    "edgerunners-error-log",
    "edgerunners-mock-log",
    "edgerunners-scratchpad",
    "edgerunners-planner-tasks",
    "jee-nexus-progress-v1"
  ].some((key) => window.localStorage.getItem(key));
}

export function importLegacyProgress(current: StudyState): StudyState {
  if (typeof window === "undefined") return current;

  const next = structuredClone(current);
  const legacyErrors = safeRead<ErrorLog[]>("edgerunners-error-log", []);
  const legacyMocks = safeRead<Array<MockTest & { total?: number }>>("edgerunners-mock-log", []);
  const legacyTasks = safeRead<Record<string, string>>("edgerunners-planner-tasks", {});
  const legacyProgress = safeRead<string[]>("jee-nexus-progress-v1", []);

  next.errorLogs = [
    ...next.errorLogs,
    ...legacyErrors.map((entry) => ({
      ...entry,
      id: crypto.randomUUID(),
      mistakeType: mistakeTypes.includes(entry.mistakeType) ? entry.mistakeType : "Conceptual",
      weakChapter: entry.weakChapter || entry.topic,
      repeatCount: Math.max(1, Number(entry.repeatCount || 1)),
      repairTask: entry.repairTask || `Repair ${entry.topic} with three examples and one note.`
    }))
  ];
  next.mockTests = [
    ...next.mockTests,
    ...legacyMocks.map((mock) => ({
      id: crypto.randomUUID(),
      name: mock.name || "Imported mock",
      date: mock.date || todayKey(),
      physics: Number(mock.physics || 0),
      chemistry: Number(mock.chemistry || 0),
      math: Number(mock.math || 0),
      physicsAccuracy: Number(mock.physicsAccuracy || 70),
      chemistryAccuracy: Number(mock.chemistryAccuracy || 70),
      mathAccuracy: Number(mock.mathAccuracy || 70),
      physicsWeakChapter: mock.physicsWeakChapter || "Mixed Physics",
      chemistryWeakChapter: mock.chemistryWeakChapter || "Mixed Chemistry",
      mathWeakChapter: mock.mathWeakChapter || "Mixed Mathematics"
    }))
  ];
  next.plannerTasks = { ...next.plannerTasks, ...legacyTasks };
  next.scratchpad = window.localStorage.getItem("edgerunners-scratchpad") || next.scratchpad;

  legacyProgress.forEach((id) => {
    next.completedTopics[id] = true;
  });

  writeLocalState(next);
  window.localStorage.setItem("edgerunners-legacy-imported", todayKey());
  return next;
}

function normalizeState(value: Partial<StudyState>): StudyState {
  const seeded = seedState();
  const next = {
    ...seeded,
    ...value,
    plannerTasks: { ...seeded.plannerTasks, ...(value.plannerTasks || {}) },
    completedTopics: { ...seeded.completedTopics, ...(value.completedTopics || {}) },
    completedAt: { ...seeded.completedAt, ...(value.completedAt || {}) },
    confidence: { ...seeded.confidence, ...(value.confidence || {}) },
    revisionDone: { ...seeded.revisionDone, ...(value.revisionDone || {}) },
    questionsSolved: Number(value.questionsSolved ?? seeded.questionsSolved),
    streakDays: Number(value.streakDays ?? seeded.streakDays),
    lastStudyDate: value.lastStudyDate || seeded.lastStudyDate
  };

  next.errorLogs = (value.errorLogs || seeded.errorLogs).map((entry) => ({
    ...entry,
    mistakeType: mistakeTypes.includes(entry.mistakeType) ? entry.mistakeType : "Conceptual",
    weakChapter: entry.weakChapter || entry.topic,
    repeatCount: Math.max(1, Number(entry.repeatCount || 1)),
    repairTask: entry.repairTask || `Repair ${entry.topic} with three examples and one note.`
  }));

  next.mockTests = (value.mockTests || seeded.mockTests).map((mock) => ({
    ...mock,
    physicsAccuracy: Number(mock.physicsAccuracy || Math.min(100, Math.max(35, mock.physics))),
    chemistryAccuracy: Number(mock.chemistryAccuracy || Math.min(100, Math.max(35, mock.chemistry))),
    mathAccuracy: Number(mock.mathAccuracy || Math.min(100, Math.max(35, mock.math))),
    physicsWeakChapter: mock.physicsWeakChapter || "Mixed Physics",
    chemistryWeakChapter: mock.chemistryWeakChapter || "Mixed Chemistry",
    mathWeakChapter: mock.mathWeakChapter || "Mixed Mathematics"
  }));

  writeLocalState(next);
  return next;
}

function safeRead<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback)) as T;
  } catch {
    return fallback;
  }
}
