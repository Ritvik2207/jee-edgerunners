import {
  buildRevisionItems,
  nextTopic,
  subjectAccuracy,
  subjectScore,
  subjectWeakChapter,
  syllabusTopics,
  todayKey,
  type StudyState,
  type Subject
} from "@/lib/study-data";

export type PlannerBlock = {
  key: "maths" | "physics" | "chemistry" | "revision";
  label: string;
  subject?: Subject;
  title: string;
  detail: string;
  reason: string;
  action: string;
  minutes: number;
  color: string;
};

const subjectKey: Record<Subject, "maths" | "physics" | "chemistry"> = {
  Mathematics: "maths",
  Physics: "physics",
  Chemistry: "chemistry"
};

const subjectColor: Record<Subject, string> = {
  Mathematics: "#ff4f7b",
  Physics: "#22d3ee",
  Chemistry: "#b7ff3c"
};

function roundToFive(minutes: number) {
  return Math.max(10, Math.round(minutes / 5) * 5);
}

function unresolvedErrors(state: StudyState, subject: Subject) {
  return state.errorLogs
    .filter((entry) => entry.subject === subject && !entry.resolved)
    .sort((a, b) => b.repeatCount - a.repeatCount || b.date.localeCompare(a.date));
}

function incompleteTopicPressure(state: StudyState, subject: Subject) {
  return syllabusTopics
    .filter((topic) => topic.subject === subject && !state.completedTopics[topic.id])
    .reduce((score, topic) => {
      const priorityBoost = topic.priority === "High" ? 1.4 : topic.priority === "Core" ? 1 : topic.priority === "Scoring" ? 0.8 : 0.55;
      const confidencePenalty = Math.max(0, 70 - (state.confidence[topic.id] || 0)) / 70;
      return score + priorityBoost + confidencePenalty;
    }, 0);
}

function focusForSubject(state: StudyState, subject: Subject) {
  const latestMock = state.mockTests.at(-1);
  const error = unresolvedErrors(state, subject)[0];

  if (error) {
    return {
      title: `${subject} repair block`,
      detail: error.weakChapter || error.topic,
      reason: `${error.mistakeType}, repeated ${error.repeatCount}x`,
      action: error.repairTask || `Redo ${error.topic} and write one correction note.`
    };
  }

  if (latestMock) {
    const score = subjectScore(latestMock, subject);
    const accuracy = subjectAccuracy(latestMock, subject);
    const weakChapter = subjectWeakChapter(latestMock, subject);
    if (score < 70 || accuracy < 75) {
      return {
        title: `${subject} weak mock repair`,
        detail: weakChapter || nextTopic(state, subject),
        reason: `${score}/100, ${accuracy}% accuracy in latest mock`,
        action: `Do 20 targeted questions and log every miss from ${weakChapter || subject}.`
      };
    }
  }

  const topic = syllabusTopics
    .filter((item) => item.subject === subject && !state.completedTopics[item.id])
    .sort((a, b) => {
      const priorityScore = { High: 4, Core: 3, Scoring: 2, Foundation: 1 };
      return priorityScore[b.priority] - priorityScore[a.priority] || (state.confidence[a.id] || 0) - (state.confidence[b.id] || 0);
    })[0];

  return {
    title: `${subject} syllabus push`,
    detail: topic?.title || nextTopic(state, subject),
    reason: topic ? `${topic.priority} priority incomplete topic` : "No urgent gap found",
    action: topic ? `Finish notes, 15 examples, and mark confidence for ${topic.title}.` : "Run mixed PYQ revision."
  };
}

function subjectWeight(state: StudyState, subject: Subject) {
  const latestMock = state.mockTests.at(-1);
  const errors = unresolvedErrors(state, subject);
  let weight = 1 + errors.length * 0.75 + errors.reduce((sum, entry) => sum + Math.max(0, entry.repeatCount - 1) * 0.2, 0);
  weight += incompleteTopicPressure(state, subject) * 0.07;

  if (latestMock) {
    const score = subjectScore(latestMock, subject);
    const accuracy = subjectAccuracy(latestMock, subject);
    weight += Math.max(0, 75 - score) / 35;
    weight += Math.max(0, 78 - accuracy) / 45;
  }

  return weight;
}

function revisionFocus(state: StudyState) {
  const today = todayKey();
  const dueRevision = buildRevisionItems(state).find((item) => !item.completed && item.dueDate <= today);
  if (dueRevision) {
    return {
      detail: `${dueRevision.topicTitle} (${dueRevision.stage})`,
      reason: dueRevision.status === "overdue" ? `Revision overdue since ${dueRevision.dueDate}` : "Revision due today",
      action: "Active recall first, then 10 mixed questions."
    };
  }

  const repair = state.errorLogs.filter((entry) => !entry.resolved).sort((a, b) => b.repeatCount - a.repeatCount)[0];
  if (repair) {
    return {
      detail: repair.weakChapter || repair.topic,
      reason: `${repair.mistakeType} mistake still unresolved`,
      action: repair.repairTask || "Write the corrected method and solve three similar questions."
    };
  }

  const upcoming = buildRevisionItems(state).find((item) => !item.completed);
  return {
    detail: upcoming ? `${upcoming.topicTitle} (${upcoming.stage})` : "Formula notebook and mistake log",
    reason: upcoming ? `Next scheduled revision: ${upcoming.dueDate}` : "No due revision yet",
    action: upcoming ? "Preview formulas and attempt a short recall test." : "Review formula notebook and close any loose mistakes."
  };
}

export function buildDailyPlan(state: StudyState): PlannerBlock[] {
  const total = roundToFive(Math.max(1, Math.min(14, state.hoursToday)) * 60);
  const dueRevisionCount = buildRevisionItems(state).filter((item) => !item.completed && item.dueDate <= todayKey()).length;
  const unresolvedCount = state.errorLogs.filter((entry) => !entry.resolved).length;
  const revision = total <= 120 ? 25 : Math.min(110, Math.max(40, roundToFive(total * (0.18 + Math.min(0.08, (dueRevisionCount + unresolvedCount) * 0.015)))));
  const study = total - revision;

  const subjectWeights: Record<Subject, number> = {
    Mathematics: subjectWeight(state, "Mathematics"),
    Physics: subjectWeight(state, "Physics"),
    Chemistry: subjectWeight(state, "Chemistry")
  };
  const weightTotal = subjectWeights.Mathematics + subjectWeights.Physics + subjectWeights.Chemistry;
  const maths = roundToFive((study * subjectWeights.Mathematics) / weightTotal);
  const physics = roundToFive((study * subjectWeights.Physics) / weightTotal);
  const chemistry = Math.max(25, study - maths - physics);
  const minutes: Record<Subject, number> = { Mathematics: maths, Physics: physics, Chemistry: chemistry };
  const revisionPlan = revisionFocus(state);

  const subjectBlocks = (["Mathematics", "Physics", "Chemistry"] as Subject[]).map((subject) => {
    const focus = focusForSubject(state, subject);
    return {
      key: subjectKey[subject],
      label: subject === "Mathematics" ? "Maths" : subject,
      subject,
      title: focus.title,
      detail: focus.detail,
      reason: focus.reason,
      action: focus.action,
      minutes: minutes[subject],
      color: subjectColor[subject]
    };
  });

  return [
    ...subjectBlocks,
    {
      key: "revision",
      label: "Revision",
      title: "Recall and repair",
      detail: revisionPlan.detail,
      reason: revisionPlan.reason,
      action: revisionPlan.action,
      minutes: revision,
      color: "#fbbf24"
    }
  ];
}

export function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
}
