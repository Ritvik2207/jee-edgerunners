import { seedState, todayKey, type ErrorLog, type MockTest, type StudyState } from "@/lib/study-data";

const stateKey = "edgerunners-webapp-state-v1";

export function readLocalState(): StudyState {
  if (typeof window === "undefined") return seedState();
  try {
    return JSON.parse(window.localStorage.getItem(stateKey) || "") as StudyState;
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

  next.errorLogs = [...next.errorLogs, ...legacyErrors.map((entry) => ({ ...entry, id: `legacy-${entry.id || crypto.randomUUID()}` }))];
  next.mockTests = [
    ...next.mockTests,
    ...legacyMocks.map((mock) => ({
      id: `legacy-${mock.id || crypto.randomUUID()}`,
      name: mock.name || "Imported mock",
      date: mock.date || todayKey(),
      physics: Number(mock.physics || 0),
      chemistry: Number(mock.chemistry || 0),
      math: Number(mock.math || 0)
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

function safeRead<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback)) as T;
  } catch {
    return fallback;
  }
}
