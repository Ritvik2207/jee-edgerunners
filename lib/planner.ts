import { nextTopic, type StudyState, type Subject } from "@/lib/study-data";

export type PlannerBlock = {
  key: "maths" | "physics" | "chemistry" | "revision";
  label: string;
  subject?: Subject;
  title: string;
  detail: string;
  minutes: number;
  color: string;
};

function roundToFive(minutes: number) {
  return Math.round(minutes / 5) * 5;
}

export function buildDailyPlan(state: StudyState): PlannerBlock[] {
  const total = roundToFive(Math.max(1, Math.min(14, state.hoursToday)) * 60);
  const revision = total <= 120 ? 20 : Math.min(90, Math.max(35, roundToFive(total * 0.18)));
  const study = total - revision;
  const maths = roundToFive(study * 0.34);
  const physics = roundToFive(study * 0.33);
  const chemistry = study - maths - physics;

  return [
    {
      key: "maths",
      label: "Maths",
      subject: "Mathematics",
      title: "Mathematics practice",
      detail: state.plannerTasks.maths || nextTopic(state, "Mathematics"),
      minutes: maths,
      color: "#ff4f7b"
    },
    {
      key: "physics",
      label: "Physics",
      subject: "Physics",
      title: "Physics concept + examples",
      detail: state.plannerTasks.physics || nextTopic(state, "Physics"),
      minutes: physics,
      color: "#22d3ee"
    },
    {
      key: "chemistry",
      label: "Chemistry",
      subject: "Chemistry",
      title: "Chemistry NCERT + problems",
      detail: state.plannerTasks.chemistry || nextTopic(state, "Chemistry"),
      minutes: chemistry,
      color: "#b7ff3c"
    },
    {
      key: "revision",
      label: "Revision",
      title: "Recall and repair",
      detail: state.plannerTasks.revision || state.errorLogs.at(-1)?.topic || "Formula notebook and mistake log",
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
