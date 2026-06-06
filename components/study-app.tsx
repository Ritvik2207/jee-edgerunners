"use client";

import Link from "next/link";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import type { User as SupabaseAuthUser } from "@supabase/supabase-js";
import {
  BarChart3,
  Bell,
  BookMarked,
  BookOpenCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardList,
  Clock3,
  Flame,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  NotebookPen,
  Pause,
  Play,
  Save,
  Search,
  Settings,
  Sparkles,
  Target,
  TimerReset,
  Trophy,
  UserCircle2,
  Zap
} from "lucide-react";
import { buildDailyPlan, formatMinutes, type PlannerBlock } from "@/lib/planner";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import {
  buildStudyActions,
  chapterGuideForTopic,
  formatHours,
  markStudyActivity,
  mistakeTypes,
  practiceAccuracy,
  revisionTaskKey,
  seedState,
  subjectAccuracy,
  subjectMeta,
  subjectProgress,
  subjectScore,
  subjectWeakChapter,
  subjects,
  syllabusTopics,
  todayKey,
  totalMockScore,
  weakestMockSubject,
  type ErrorLog,
  type ChapterGuide,
  type MistakeType,
  type MockTest,
  type StudyActionItem,
  type StudyState,
  type Subject,
  type Topic,
  type ViewKey
} from "@/lib/study-data";
import { hasLegacyProgress, importLegacyProgress, readLocalState, writeLocalState } from "@/lib/storage";

type StudyAppProps = {
  initialView: ViewKey;
};

type UserState = {
  id: string;
  email: string;
  name: string;
  demo: boolean;
  profileComplete: boolean;
};

type ActiveSession = {
  subject?: Subject;
  topic: string;
  source: string;
  minutes: number;
  blockKey?: PlannerBlock["key"];
};

type SearchResult = {
  label: string;
  detail: string;
  href: string;
  color?: string;
};

const navigation = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Study" },
  { key: "planner", label: "Daily Planner", href: "/planner", icon: CalendarDays, group: "Study" },
  { key: "syllabus", label: "Syllabus", href: "/syllabus", icon: GraduationCap, group: "Study" },
  { key: "error-book", label: "Error Book", href: "/error-book", icon: NotebookPen, group: "Study" },
  { key: "mocks", label: "Mock Tests", href: "/mocks", icon: Target, group: "Analytics" },
  { key: "resources", label: "Resources", href: "/resources", icon: BookMarked, group: "Resources" },
  { key: "settings", label: "Settings", href: "/settings", icon: Settings, group: "Resources" }
] as const;

const quotes = [
  "Discipline is choosing between what you want now and what you want most.",
  "One repaired mistake is worth ten rushed questions.",
  "Consistency beats panic. Build the day, then execute it."
];

const demoUser: UserState = { id: "demo-local", email: "demo@local", name: "Ritvik Kumar", demo: true, profileComplete: true };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function authDisplayName(authUser: SupabaseAuthUser) {
  const metadata = (authUser.user_metadata ?? {}) as Record<string, unknown>;
  const candidates = [
    metadata.display_name,
    metadata.full_name,
    metadata.name,
    metadata.user_name
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }

  return "";
}

function greetingName(user: UserState | null) {
  return user?.name.trim().split(/\s+/)[0] || "Student";
}

function loggedQuestionCount(state: StudyState) {
  return state.questionsSolved + state.mockTests.length * 90;
}

function buildSearchResults(state: StudyState, rawQuery: string): SearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const matches = (parts: Array<string | number | undefined>) => parts.some((part) => String(part || "").toLowerCase().includes(query));
  const results: SearchResult[] = [];

  syllabusTopics.forEach((topic) => {
    if (matches([topic.title, topic.subject, topic.track, topic.priority])) {
      results.push({
        label: topic.title,
        detail: `${topic.subject} | ${topic.track} | ${state.completedTopics[topic.id] ? "completed" : "incomplete"}`,
        href: "/syllabus",
        color: subjectMeta[topic.subject].color
      });
    }
  });

  state.errorLogs.forEach((entry) => {
    if (matches([entry.topic, entry.weakChapter, entry.mistakeType, entry.reason, entry.repairTask])) {
      results.push({
        label: entry.topic,
        detail: `${entry.subject} error | ${entry.resolved ? "resolved" : "open repair"}`,
        href: "/error-book",
        color: subjectMeta[entry.subject].color
      });
    }
  });

  state.mockTests.forEach((mock) => {
    if (matches([mock.name, mock.physicsWeakChapter, mock.chemistryWeakChapter, mock.mathWeakChapter])) {
      results.push({
        label: mock.name,
        detail: `${totalMockScore(mock)} / 300 | weakest ${weakestMockSubject({ ...state, mockTests: [mock] })?.subject || "mixed"}`,
        href: "/mocks",
        color: "#fbbf24"
      });
    }
  });

  if (matches([state.scratchpad])) {
    results.push({
      label: "Scratchpad note",
      detail: "Saved formula or note text",
      href: "/dashboard#scratchpad",
      color: "#b7ff3c"
    });
  }

  return results.slice(0, 8);
}

function sessionFromBlock(block: PlannerBlock): ActiveSession {
  return {
    subject: block.subject,
    topic: block.detail,
    source: block.label,
    minutes: 25,
    blockKey: block.key
  };
}

function buildMockRepairEntries(mock: MockTest): ErrorLog[] {
  return subjects.flatMap((subject) => {
    const score = subjectScore(mock, subject);
    const accuracy = subjectAccuracy(mock, subject);
    const weakChapter = subjectWeakChapter(mock, subject).trim();

    if (!weakChapter || (score >= 70 && accuracy >= 75)) return [];

    const mistakeType: MistakeType = accuracy < 65 ? "Conceptual" : score < 65 ? "Time Pressure" : "Calculation";
    return [{
      id: crypto.randomUUID(),
      subject,
      topic: weakChapter,
      weakChapter,
      mistakeType,
      repeatCount: 1,
      repairTask: `Repair ${weakChapter}: revise notes, solve 20 targeted questions, and log every miss.`,
      reason: `Created from ${mock.name}: ${score}/100 marks and ${accuracy}% accuracy.`,
      date: todayKey(),
      resolved: false
    }];
  });
}

export function StudyApp({ initialView }: StudyAppProps) {
  const [view] = useState<ViewKey>(initialView);
  const [state, setState] = useState<StudyState>(() => seedState());
  const [user, setUser] = useState<UserState | null>(() => (isSupabaseConfigured() ? null : demoUser));
  const [loadingUser, setLoadingUser] = useState(() => isSupabaseConfigured());
  const [syncStatus, setSyncStatus] = useState("Local demo ready");
  const [authMessage, setAuthMessage] = useState("");
  const [authForm, setAuthForm] = useState({ email: "", password: "", name: "" });
  const [profileName, setProfileName] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [errorForm, setErrorForm] = useState({
    subject: "Physics" as Subject,
    topic: "",
    weakChapter: "",
    mistakeType: "Conceptual" as MistakeType,
    repeatCount: 1,
    repairTask: "",
    reason: ""
  });
  const [mockForm, setMockForm] = useState({
    name: "",
    date: todayKey(),
    physics: 0,
    chemistry: 0,
    math: 0,
    physicsAccuracy: 70,
    chemistryAccuracy: 70,
    mathAccuracy: 70,
    physicsWeakChapter: "",
    chemistryWeakChapter: "",
    mathWeakChapter: ""
  });
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const supabase = useMemo(() => getSupabaseClient(), []);
  const plan = useMemo(() => buildDailyPlan(state), [state]);
  const actionItems = useMemo(() => buildStudyActions(state), [state]);
  const latestMock = state.mockTests.at(-1);
  const searchResults = useMemo(() => buildSearchResults(state, searchQuery), [state, searchQuery]);
  const dueRevisionCount = useMemo(
    () => actionItems.filter((item) => !item.completed && item.dueDate <= todayKey()).length,
    [actionItems]
  );
  const hasLegacy = hasLegacyProgress();

  useEffect(() => {
    let mounted = true;

    async function boot() {
      if (!supabase) {
        if (mounted) {
          setState(readLocalState());
          setUser(demoUser);
          setLoadingUser(false);
          setSyncStatus("Demo mode: add Supabase keys for account sync");
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;
      if (sessionUser && mounted) {
        const userState = await resolveUserState(sessionUser);
        setUser(userState);
        await loadRemoteState(userState.id);
      }

      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!session?.user) {
          setUser(null);
          setLoadingUser(false);
          return;
        }
        const userState = await resolveUserState(session.user);
        setUser(userState);
        await loadRemoteState(userState.id);
      });

      if (mounted) setLoadingUser(false);
      return () => listener.subscription.unsubscribe();
    }

    void boot();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  useEffect(() => {
    if (!timerRunning) return;
    const timer = window.setInterval(() => {
      setTimerSeconds((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timer);
          setTimerRunning(false);
          completePomodoro();
          return 25 * 60;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timerRunning, state, activeSession]);

  async function resolveUserState(authUser: SupabaseAuthUser): Promise<UserState> {
    const metadataName = authDisplayName(authUser);
    let displayName = metadataName;
    let profileComplete = Boolean(metadataName);

    if (supabase) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, onboarding_complete")
          .eq("id", authUser.id)
          .maybeSingle();

        const savedName = typeof profile?.display_name === "string" ? profile.display_name.trim() : "";
        displayName = savedName || metadataName;
        profileComplete = Boolean(displayName);

        await supabase.from("profiles").upsert(
          {
            id: authUser.id,
            display_name: displayName || null,
            onboarding_complete: Boolean(displayName),
            updated_at: new Date().toISOString()
          },
          { onConflict: "id" }
        );
      } catch {
        setSyncStatus("Profile table not ready; using auth account data");
      }
    }

    setProfileName(displayName);
    return {
      id: authUser.id,
      email: authUser.email || "student",
      name: displayName,
      demo: false,
      profileComplete
    };
  }

  async function loadRemoteState(userId: string) {
    if (!supabase) return;
    try {
      const [profile, progress, planner, tasks, errors, mocks, scratchpad, sessions] = await Promise.all([
        supabase.from("profiles").select("streak_days, last_study_date, questions_solved").eq("id", userId).maybeSingle(),
        supabase.from("syllabus_progress").select("topic_id, completed, confidence, completed_at, revision_done").eq("user_id", userId),
        supabase.from("planner_days").select("hours").eq("user_id", userId).eq("plan_date", todayKey()).maybeSingle(),
        supabase.from("planner_tasks").select("block_key, task_text").eq("user_id", userId).eq("plan_date", todayKey()),
        supabase.from("error_logs").select("id, subject, topic, reason, mistake_type, weak_chapter, repeat_count, repair_task, logged_on, resolved").eq("user_id", userId).order("logged_on", { ascending: true }),
        supabase.from("mock_tests").select("id, name, taken_on, physics, chemistry, math, physics_accuracy, chemistry_accuracy, math_accuracy, physics_weak_chapter, chemistry_weak_chapter, math_weak_chapter").eq("user_id", userId).order("taken_on", { ascending: true }),
        supabase.from("scratchpad_notes").select("body").eq("user_id", userId).maybeSingle(),
        supabase.from("pomodoro_sessions").select("id").eq("user_id", userId).gte("completed_at", `${todayKey()}T00:00:00`)
      ]);

      const next = readLocalState();
      next.completedTopics = Object.fromEntries((progress.data || []).map((row) => [row.topic_id, row.completed]));
      next.confidence = Object.fromEntries((progress.data || []).map((row) => [row.topic_id, row.confidence || 50]));
      next.completedAt = Object.fromEntries((progress.data || []).filter((row) => row.completed_at).map((row) => [row.topic_id, row.completed_at]));
      next.revisionDone = Object.assign({}, ...((progress.data || []).map((row) => {
        const done = (row.revision_done || {}) as Record<string, boolean>;
        return Object.fromEntries(Object.entries(done).map(([stage, completed]) => [revisionTaskKey(row.topic_id, stage as "1-day" | "7-day" | "21-day"), completed]));
      })));
      next.hoursToday = Number(planner.data?.hours || next.hoursToday);
      next.plannerTasks = Object.fromEntries((tasks.data || []).map((row) => [row.block_key, row.task_text || ""]));
      next.errorLogs = (errors.data || []).map((row) => ({
        id: row.id,
        subject: row.subject as Subject,
        topic: row.topic,
        reason: row.reason,
        mistakeType: (row.mistake_type || "Conceptual") as MistakeType,
        weakChapter: row.weak_chapter || row.topic,
        repeatCount: Number(row.repeat_count || 1),
        repairTask: row.repair_task || `Repair ${row.topic} with three examples and one note.`,
        date: row.logged_on,
        resolved: row.resolved
      }));
      next.mockTests = (mocks.data || []).map((row) => ({
        id: row.id,
        name: row.name,
        date: row.taken_on,
        physics: row.physics,
        chemistry: row.chemistry,
        math: row.math,
        physicsAccuracy: row.physics_accuracy || 70,
        chemistryAccuracy: row.chemistry_accuracy || 70,
        mathAccuracy: row.math_accuracy || 70,
        physicsWeakChapter: row.physics_weak_chapter || "",
        chemistryWeakChapter: row.chemistry_weak_chapter || "",
        mathWeakChapter: row.math_weak_chapter || ""
      }));
      next.scratchpad = scratchpad.data?.body || next.scratchpad;
      next.sessionsToday = sessions.data?.length || 0;
      next.questionsSolved = Number(profile.data?.questions_solved ?? next.questionsSolved);
      next.streakDays = Number(profile.data?.streak_days ?? next.streakDays);
      next.lastStudyDate = profile.data?.last_study_date || next.lastStudyDate;
      setState(next);
      writeLocalState(next);
      setSyncStatus("Synced with Supabase");
    } catch {
      setSyncStatus("Supabase tables not ready; using local demo data");
    }
  }

  async function persistState(next: StudyState) {
    writeLocalState(next);
    if (!supabase || !user || user.demo) return;

    try {
      const progressRows = Object.entries(next.completedTopics).map(([topicId, completed]) => ({
        user_id: user.id,
        topic_id: topicId,
        completed,
        confidence: next.confidence[topicId] || 50,
        completed_at: next.completedAt[topicId] || null,
        revision_done: {
          "1-day": Boolean(next.revisionDone[revisionTaskKey(topicId, "1-day")]),
          "7-day": Boolean(next.revisionDone[revisionTaskKey(topicId, "7-day")]),
          "21-day": Boolean(next.revisionDone[revisionTaskKey(topicId, "21-day")])
        }
      }));
      const taskRows = Object.entries(next.plannerTasks).map(([blockKey, taskText]) => ({
        user_id: user.id,
        plan_date: todayKey(),
        block_key: blockKey,
        task_text: taskText
      }));
      const errorRows = next.errorLogs
        .filter((entry) => uuidPattern.test(entry.id))
        .map((entry) => ({
          id: entry.id,
          user_id: user.id,
          subject: entry.subject,
          topic: entry.topic,
          reason: entry.reason,
          mistake_type: entry.mistakeType,
          weak_chapter: entry.weakChapter,
          repeat_count: entry.repeatCount,
          repair_task: entry.repairTask,
          logged_on: entry.date,
          resolved: entry.resolved
        }));
      const mockRows = next.mockTests
        .filter((mock) => uuidPattern.test(mock.id))
        .map((mock) => ({
          id: mock.id,
          user_id: user.id,
          name: mock.name,
          taken_on: mock.date,
          physics: mock.physics,
          chemistry: mock.chemistry,
          math: mock.math,
          physics_accuracy: mock.physicsAccuracy,
          chemistry_accuracy: mock.chemistryAccuracy,
          math_accuracy: mock.mathAccuracy,
          physics_weak_chapter: mock.physicsWeakChapter,
          chemistry_weak_chapter: mock.chemistryWeakChapter,
          math_weak_chapter: mock.mathWeakChapter
        }));

      await Promise.all([
        supabase.from("planner_days").upsert(
          { user_id: user.id, plan_date: todayKey(), hours: next.hoursToday, plan_summary: { blocks: buildDailyPlan(next) } },
          { onConflict: "user_id,plan_date" }
        ),
        progressRows.length ? supabase.from("syllabus_progress").upsert(progressRows, { onConflict: "user_id,topic_id" }) : Promise.resolve(),
        taskRows.length ? supabase.from("planner_tasks").upsert(taskRows, { onConflict: "user_id,plan_date,block_key" }) : Promise.resolve(),
        errorRows.length ? supabase.from("error_logs").upsert(errorRows, { onConflict: "id" }) : Promise.resolve(),
        mockRows.length ? supabase.from("mock_tests").upsert(mockRows, { onConflict: "id" }) : Promise.resolve(),
        supabase.from("profiles").upsert(
          {
            id: user.id,
            streak_days: next.streakDays,
            last_study_date: next.lastStudyDate || null,
            questions_solved: next.questionsSolved,
            updated_at: new Date().toISOString()
          },
          { onConflict: "id" }
        ),
        supabase.from("scratchpad_notes").upsert({ user_id: user.id, body: next.scratchpad }, { onConflict: "user_id" })
      ]);
      setSyncStatus("Saved online");
    } catch {
      setSyncStatus("Could not save online; local copy kept");
    }
  }

  function commitState(next: StudyState) {
    setState(next);
    void persistState(next);
  }

  function startSession(block?: PlannerBlock) {
    const nextBlock = block || plan.find((item) => !state.plannerTasks[item.key]) || plan[0];
    if (!nextBlock) return;

    setActiveSession(sessionFromBlock(nextBlock));
    setTimerSeconds(25 * 60);
    setTimerRunning(true);
    setSyncStatus(`Session started: ${nextBlock.detail}`);
  }

  function completePomodoro() {
    const next = markStudyActivity({
      ...state,
      sessionsToday: state.sessionsToday + 1
    });
    commitState(next);
    void recordPomodoro(activeSession);
    setSyncStatus(`Completed ${activeSession?.topic || "focus session"}`);
  }

  async function recordPomodoro(session: ActiveSession | null) {
    if (!supabase || !user || user.demo) return;
    await supabase.from("pomodoro_sessions").insert({
      user_id: user.id,
      subject: session?.subject || null,
      topic: session?.topic || "Manual focus session",
      duration_minutes: session?.minutes || 25
    });
  }

  async function signIn() {
    if (!supabase) {
      setAuthMessage("Supabase is not configured yet. You are using local demo mode.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email: authForm.email, password: authForm.password });
    setAuthMessage(error ? error.message : "Signed in.");
  }

  async function signUp() {
    if (!supabase) {
      setAuthMessage("Supabase is not configured yet. You are using local demo mode.");
      return;
    }
    const { error } = await supabase.auth.signUp({
      email: authForm.email,
      password: authForm.password,
      options: { data: { display_name: authForm.name.trim(), full_name: authForm.name.trim() } }
    });
    setAuthMessage(error ? error.message : "Account created. Check email if confirmation is enabled.");
  }

  async function signInWithGoogle() {
    if (!supabase) {
      setAuthMessage("Add Supabase keys and enable Google provider first.");
      return;
    }
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });
  }

  async function saveProfileName() {
    const nextName = profileName.trim();
    if (!nextName) {
      setProfileMessage("Enter your name to continue.");
      return;
    }
    if (!supabase || !user || user.demo) return;

    try {
      const [{ error: profileError }, { error: authError }] = await Promise.all([
        supabase.from("profiles").upsert(
          {
            id: user.id,
            display_name: nextName,
            onboarding_complete: true,
            updated_at: new Date().toISOString()
          },
          { onConflict: "id" }
        ),
        supabase.auth.updateUser({ data: { display_name: nextName, full_name: nextName } })
      ]);

      if (profileError || authError) {
        setProfileMessage(profileError?.message || authError?.message || "Could not save profile name.");
        return;
      }

      setUser({ ...user, name: nextName, profileComplete: true });
      setSyncStatus("Profile saved online");
      setProfileMessage("");
    } catch {
      setProfileMessage("Could not save profile name. Check Supabase setup.");
    }
  }

  async function signOut() {
    if (supabase && !user?.demo) await supabase.auth.signOut();
    setUser(supabase ? null : demoUser);
  }

  if (loadingUser) {
    return <div className="grid min-h-screen place-items-center text-edge-muted">Loading JEE Edgerunners...</div>;
  }

  if (!user && isSupabaseConfigured()) {
    return (
      <AuthScreen
        authForm={authForm}
        authMessage={authMessage}
        setAuthForm={setAuthForm}
        signIn={signIn}
        signUp={signUp}
        signInWithGoogle={signInWithGoogle}
      />
    );
  }

  if (user && !user.demo && !user.profileComplete) {
    return (
      <ProfileSetupScreen
        user={user}
        profileName={profileName}
        profileMessage={profileMessage}
        setProfileName={setProfileName}
        saveProfileName={saveProfileName}
        signOut={signOut}
      />
    );
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[270px_1fr]">
      <Sidebar activeView={view} />

      <main className="min-w-0 pb-24 lg:pb-0">
        <Topbar
          user={user}
          state={state}
          syncStatus={syncStatus}
          signOut={signOut}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchInputRef={searchInputRef}
          dueRevisionCount={dueRevisionCount}
        />

        <div className="mx-auto max-w-[1530px] px-4 py-8 sm:px-6 lg:px-10">
          <Header state={state} user={user} />
          {searchQuery.trim() && (
            <SearchResultsPanel
              query={searchQuery}
              results={searchResults}
              clearSearch={() => setSearchQuery("")}
            />
          )}

          {(view === "dashboard" || view === "planner") && (
            <DashboardGrid
              state={state}
              plan={plan}
              latestMock={latestMock}
              timerSeconds={timerSeconds}
              timerRunning={timerRunning}
              setTimerRunning={setTimerRunning}
              setTimerSeconds={setTimerSeconds}
              activeSession={activeSession}
              startSession={startSession}
              commitState={commitState}
              actionItems={actionItems}
            />
          )}

          {view === "syllabus" && <SyllabusPanel state={state} commitState={commitState} expanded />}

          {view === "error-book" && (
            <ErrorBookPanel
              state={state}
              errorForm={errorForm}
              setErrorForm={setErrorForm}
              commitState={commitState}
              expanded={view === "error-book"}
            />
          )}

          {view === "mocks" && (
            <MockPanel state={state} mockForm={mockForm} setMockForm={setMockForm} commitState={commitState} expanded={view === "mocks"} />
          )}

          {view === "settings" && (
            <SettingsPanel
              state={state}
              user={user}
              hasLegacy={hasLegacy}
              syncStatus={syncStatus}
              commitState={commitState}
              signOut={signOut}
            />
          )}
        </div>
      </main>
      <MobileNav activeView={view} />
    </div>
  );
}

function AuthScreen({
  authForm,
  authMessage,
  setAuthForm,
  signIn,
  signUp,
  signInWithGoogle
}: {
  authForm: { email: string; password: string; name: string };
  authMessage: string;
  setAuthForm: (form: { email: string; password: string; name: string }) => void;
  signIn: () => void;
  signUp: () => void;
  signInWithGoogle: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <section className="edge-panel w-full max-w-md rounded-xl p-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-edge-lime">Account sync</p>
        <h1 className="mt-2 text-3xl font-black">Sign in to JEE Edgerunners</h1>
        <p className="mt-3 text-sm leading-6 text-edge-muted">Progress saves online after Supabase is connected. Google sign-in uses your Google profile name when available.</p>
        <div className="mt-6 grid gap-3">
          <input className="input-shell px-3" placeholder="Name for email signup" value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} />
          <input className="input-shell px-3" type="email" placeholder="Email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} />
          <input className="input-shell px-3" type="password" placeholder="Password" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <button className="edge-button px-4" type="button" onClick={signIn}>Sign in</button>
            <button className="ghost-button px-4" type="button" onClick={signUp}>Create</button>
          </div>
          <button className="ghost-button px-4" type="button" onClick={signInWithGoogle}>Continue with Google</button>
          {authMessage && <p className="rounded-lg border border-edge-line bg-white/[0.04] p-3 text-sm text-edge-muted">{authMessage}</p>}
        </div>
      </section>
    </main>
  );
}

function ProfileSetupScreen({
  user,
  profileName,
  profileMessage,
  setProfileName,
  saveProfileName,
  signOut
}: {
  user: UserState;
  profileName: string;
  profileMessage: string;
  setProfileName: (name: string) => void;
  saveProfileName: () => void;
  signOut: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <form
        className="edge-panel w-full max-w-md rounded-xl p-6"
        onSubmit={(event) => {
          event.preventDefault();
          void saveProfileName();
        }}
      >
        <p className="text-xs font-black uppercase tracking-[0.2em] text-edge-lime">Profile setup</p>
        <h1 className="mt-2 text-3xl font-black">What should we call you?</h1>
        <p className="mt-3 text-sm leading-6 text-edge-muted">
          This name appears on your dashboard and is saved with your online progress.
        </p>
        <div className="mt-6 grid gap-3">
          <input
            autoFocus
            className="input-shell px-3"
            placeholder="Your name"
            value={profileName}
            onChange={(event) => setProfileName(event.target.value)}
          />
          <button className="edge-button px-4" type="submit">Save name and open dashboard</button>
          <button className="ghost-button px-4" type="button" onClick={signOut}>Use another account</button>
          <p className="text-xs text-edge-muted">Signed in as {user.email}</p>
          {profileMessage && <p className="rounded-lg border border-edge-line bg-white/[0.04] p-3 text-sm text-edge-muted">{profileMessage}</p>}
        </div>
      </form>
    </main>
  );
}

function Sidebar({ activeView }: { activeView: ViewKey }) {
  const groups = ["Study", "Analytics", "Resources"];

  return (
    <aside className="hidden min-h-screen border-r border-edge-line bg-[#040c14]/90 p-5 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <Menu size={20} className="text-edge-text" />
        <div>
          <div className="text-2xl font-black italic tracking-tight">
            JEE <span className="text-edge-lime">EDGERUNNERS</span>
          </div>
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-edge-muted">JEE Main | PCM Drop-Year</div>
        </div>
      </div>

      <nav className="space-y-6">
        {groups.map((group) => (
          <div key={group}>
            <p className="mb-2 px-3 text-xs font-black uppercase tracking-[0.16em] text-edge-muted">{group}</p>
            <div className="space-y-1">
              {navigation.filter((item) => item.group === group).map((item) => {
                const active = item.key === activeView;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                      active ? "bg-edge-cyan/12 text-edge-cyan shadow-[inset_3px_0_0_#22d3ee]" : "text-edge-muted hover:bg-white/[0.04] hover:text-edge-text"
                    }`}
                    href={item.href}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="edge-panel mt-8 rounded-xl p-4">
        <p className="font-black text-edge-lime">Free Tool Focus</p>
        <p className="mt-2 text-sm leading-5 text-edge-muted">Build trust first: planner, revision, mocks, and mistake repair before any paid feature.</p>
      </div>
    </aside>
  );
}

function MobileNav({ activeView }: { activeView: ViewKey }) {
  const mobileItems = navigation.filter((item) => ["dashboard", "planner", "syllabus", "error-book", "mocks", "resources"].includes(item.key));

  return (
    <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-6 rounded-xl border border-edge-line bg-[#04101c]/95 p-2 shadow-edge backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
      {mobileItems.map((item) => {
        const Icon = item.icon;
        const active = item.key === activeView;
        return (
          <Link
            key={item.key}
            className={`grid min-h-12 place-items-center gap-1 rounded-lg text-[0.66rem] font-bold ${
              active ? "bg-edge-cyan/14 text-edge-cyan" : "text-edge-muted"
            }`}
            href={item.href}
          >
            <Icon size={18} />
            <span>{item.key === "error-book" ? "Errors" : item.key === "resources" ? "Guides" : item.label.split(" ")[0]}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Topbar({
  user,
  state,
  syncStatus,
  signOut,
  searchQuery,
  setSearchQuery,
  searchInputRef,
  dueRevisionCount
}: {
  user: UserState | null;
  state: StudyState;
  syncStatus: string;
  signOut: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  dueRevisionCount: number;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-edge-line bg-[#040c14]/88 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1530px] items-center gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-edge-line bg-[#071523] px-3">
          <Search size={17} className="text-edge-muted" />
          <input
            ref={searchInputRef}
            className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-edge-muted"
            placeholder="Search topics, tests, notes..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <kbd className="hidden rounded border border-edge-line px-2 py-1 text-xs text-edge-muted sm:inline">Ctrl K</kbd>
        </div>
        <div className="hidden items-center gap-5 text-sm md:flex">
          <div className="flex items-center gap-2"><Flame className="text-orange-400" size={20} /><span className="text-edge-muted">Saved streak</span><strong>{state.streakDays} days</strong></div>
          <div className="flex items-center gap-2"><Target className="text-edge-amber" size={20} /><span className="text-edge-muted">Focus</span><strong>{formatHours(state.hoursToday)}</strong></div>
          <Link className="flex items-center gap-2 text-edge-muted transition hover:text-edge-text" href="/resources">
            <BookMarked size={18} className="text-edge-cyan" />
            <span>Resources</span>
          </Link>
          <Link className="relative grid h-9 w-9 place-items-center rounded-lg border border-edge-line bg-white/[0.035]" href="/dashboard#action-queue" aria-label={`${dueRevisionCount} study actions due`}>
            <Bell size={18} className="text-edge-text" />
            {dueRevisionCount > 0 && <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-edge-pink px-1 text-[0.65rem] font-black text-white">{dueRevisionCount}</span>}
          </Link>
        </div>
        <button className="hidden items-center gap-3 rounded-lg border border-edge-line bg-white/[0.04] px-3 py-2 text-left sm:flex" type="button" onClick={signOut}>
          <UserCircle2 className="text-edge-lime" size={24} />
          <span className="hidden sm:block">
            <strong className="block text-sm">{user?.name || "Student"}</strong>
            <small className="text-edge-muted">{user?.demo ? syncStatus : user?.email}</small>
          </span>
          <ChevronDown size={16} className="text-edge-muted" />
        </button>
      </div>
    </header>
  );
}

function Header({ state, user }: { state: StudyState; user: UserState | null }) {
  const weak = weakestMockSubject(state);

  return (
    <div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Good evening, {greetingName(user)}!</h1>
        <p className="mt-2 text-edge-muted">Consistency &gt; Motivation. Keep the edge.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:min-w-[720px] xl:grid-cols-4">
        <StatCard label="Study Hours Today" value={formatHours(state.hoursToday)} detail="/ 8h goal" progress={(state.hoursToday / 8) * 100} />
        <StatCard label="Sessions" value={String(state.sessionsToday)} detail="Completed today" />
        <StatCard label="Accuracy (Practice)" value={`${practiceAccuracy(state)}%`} detail={weak ? `Weakest ${weak.subject}` : "No mock yet"} />
        <StatCard label="Questions Logged" value={String(loggedQuestionCount(state))} detail="Mocks + manual count" />
      </div>
    </div>
  );
}

function StatCard({ label, value, detail, progress }: { label: string; value: string; detail: string; progress?: number }) {
  return (
    <div className="edge-panel rounded-lg p-4">
      <p className="text-xs font-semibold text-edge-muted">{label}</p>
      <div className="mt-1 flex items-end gap-2">
        <strong className="text-2xl font-black">{value}</strong>
        <span className="pb-1 text-xs text-edge-muted">{detail}</span>
      </div>
      {progress !== undefined && <div className="mt-3 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-edge-cyan" style={{ width: `${Math.min(100, progress)}%` }} /></div>}
    </div>
  );
}

function SearchResultsPanel({ query, results, clearSearch }: { query: string; results: SearchResult[]; clearSearch: () => void }) {
  return (
    <section className="edge-panel mb-6 rounded-xl p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-edge-muted">Search results for <strong className="text-edge-text">{query.trim()}</strong></p>
        <button className="ghost-button min-h-8 px-3 text-xs" type="button" onClick={clearSearch}>Clear</button>
      </div>
      {results.length ? (
        <div className="grid gap-2 md:grid-cols-2">
          {results.map((result) => (
            <Link
              key={`${result.href}-${result.label}-${result.detail}`}
              className="rounded-lg border border-edge-line bg-white/[0.035] p-3 transition hover:border-edge-cyan hover:bg-edge-cyan/10"
              href={result.href}
              onClick={clearSearch}
            >
              <span className="text-xs font-black uppercase tracking-[0.14em]" style={{ color: result.color || "#b7ff3c" }}>Open</span>
              <strong className="mt-1 block">{result.label}</strong>
              <span className="mt-1 block text-sm text-edge-muted">{result.detail}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-edge-line bg-black/15 p-3 text-sm text-edge-muted">No saved topic, mock, mistake, or note matched this search.</p>
      )}
    </section>
  );
}

function MetricStrip({ state, accuracy }: { state: StudyState; accuracy: number }) {
  return (
    <div className="edge-panel mb-4 hidden gap-3 rounded-xl p-4 sm:grid sm:grid-cols-2 xl:grid-cols-5">
      <MiniMetric icon={Clock3} label="Study Time" value={formatHours(state.hoursToday)} />
      <MiniMetric icon={Target} label="Sessions" value={String(state.sessionsToday)} />
      <MiniMetric icon={ClipboardList} label="Questions" value={String(loggedQuestionCount(state))} />
      <MiniMetric icon={LineChart} label="Accuracy" value={`${accuracy}%`} />
      <MiniMetric icon={Flame} label="Day Streak" value={String(state.streakDays)} />
    </div>
  );
}

function MiniMetric({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return <div className="flex items-center gap-3"><Icon className="text-edge-cyan" size={21} /><strong>{value}</strong><span className="text-sm text-edge-muted">{label}</span></div>;
}

function DashboardGrid({
  state,
  plan,
  actionItems,
  latestMock,
  timerSeconds,
  timerRunning,
  setTimerRunning,
  setTimerSeconds,
  activeSession,
  startSession,
  commitState
}: {
  state: StudyState;
  plan: ReturnType<typeof buildDailyPlan>;
  actionItems: StudyActionItem[];
  latestMock?: MockTest;
  timerSeconds: number;
  timerRunning: boolean;
  setTimerRunning: (running: boolean) => void;
  setTimerSeconds: (seconds: number) => void;
  activeSession: ActiveSession | null;
  startSession: (block?: PlannerBlock) => void;
  commitState: (state: StudyState) => void;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
      <PlannerPanel state={state} plan={plan} startSession={startSession} commitState={commitState} />
      <ProgressSummary state={state} />
      <ErrorSummary state={state} />
      <MockSummary latestMock={latestMock} />
      <TimerPanel timerSeconds={timerSeconds} timerRunning={timerRunning} activeSession={activeSession} setTimerRunning={setTimerRunning} setTimerSeconds={setTimerSeconds} />
      <ScratchpadPanel state={state} commitState={commitState} />
      <UpcomingPanel state={state} actionItems={actionItems} commitState={commitState} />
    </div>
  );
}

function PlannerPanel({
  state,
  plan,
  startSession,
  commitState
}: {
  state: StudyState;
  plan: ReturnType<typeof buildDailyPlan>;
  startSession: (block?: PlannerBlock) => void;
  commitState: (state: StudyState) => void;
}) {
  const doneBlocks = plan.filter((block) => Boolean(state.plannerTasks[block.key])).length;

  return (
    <section className="edge-panel rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div><p className="text-xs font-black uppercase tracking-[0.18em] text-edge-muted">Daily PCM Planner</p><h2 className="mt-1 text-xl font-black">Smart repair day</h2></div>
        <Link className="ghost-button px-3 text-sm" href="/planner">View full plan</Link>
      </div>
      <div className="space-y-2 rounded-lg border border-edge-line bg-black/15 p-3">
        {plan.map((block) => (
          <div key={block.key} className="grid grid-cols-[28px_1fr] items-center gap-3 rounded-lg border border-edge-line bg-[#071523] px-3 py-2 sm:grid-cols-[28px_90px_1fr_auto]">
            <span className={`grid h-5 w-5 place-items-center rounded-full ${state.plannerTasks[block.key] ? "bg-edge-lime text-[#071014]" : "border border-edge-muted text-edge-muted"}`}>
              {state.plannerTasks[block.key] ? <Check size={14} /> : null}
            </span>
            <span className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: block.color }}>{block.label}</span>
            <div className="col-span-2 min-w-0 sm:col-span-1">
              <strong className="block text-sm">{block.detail}</strong>
              <p className="mt-1 text-xs leading-5 text-edge-muted">{block.reason}</p>
              <input
                className="mt-2 w-full min-w-0 bg-transparent text-xs text-edge-muted outline-none focus:text-edge-text"
                placeholder={block.action}
                value={state.plannerTasks[block.key] || ""}
                onChange={(event) => commitState({ ...state, plannerTasks: { ...state.plannerTasks, [block.key]: event.target.value } })}
              />
            </div>
            <span className="justify-self-start rounded-full border border-edge-line px-3 py-1 text-xs font-bold sm:justify-self-auto">{formatMinutes(block.minutes)}</span>
            <button className="ghost-button col-span-2 min-h-8 px-3 text-xs sm:col-span-4" type="button" onClick={() => startSession(block)}>Study this block</button>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_230px] sm:items-center">
        <label className="grid gap-2 text-sm text-edge-muted">
          Study hours today
          <input
            className="accent-edge-lime"
            type="range"
            min="1"
            max="14"
            step="0.25"
            value={state.hoursToday}
            onChange={(event) => commitState({ ...state, hoursToday: Number(event.target.value) })}
          />
        </label>
        <button className="edge-button px-4" type="button" onClick={() => startSession()}>
          Start Next Session <Play size={16} />
        </button>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-edge-lime" style={{ width: `${(doneBlocks / plan.length) * 100}%` }} /></div>
    </section>
  );
}

function ProgressSummary({ state }: { state: StudyState }) {
  return (
    <section className="edge-panel rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between"><p className="text-xs font-black uppercase tracking-[0.18em] text-edge-muted">Syllabus Progress</p><Link className="ghost-button px-3 text-sm" href="/syllabus">View syllabus</Link></div>
      <div className="space-y-3">
        {subjects.map((subject) => {
          const progress = subjectProgress(state, subject);
          const meta = subjectMeta[subject];
          return (
            <div key={subject} className="rounded-lg border border-edge-line bg-white/[0.035] p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: meta.glow, color: meta.color }}><BookOpenCheck size={18} /></span><strong>{subject}</strong></div>
                <strong style={{ color: meta.color }}>{progress.percent}%</strong>
              </div>
              <div className="h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${progress.percent}%`, background: meta.color }} /></div>
              <p className="mt-2 text-sm text-edge-muted">{progress.done} / {progress.total} core topics</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ErrorSummary({ state }: { state: StudyState }) {
  const openErrors = state.errorLogs.filter((entry) => !entry.resolved);
  const total = openErrors.length;
  const conceptual = openErrors.filter((entry) => entry.mistakeType === "Conceptual").length;
  const silly = openErrors.filter((entry) => entry.mistakeType === "Silly Mistake").length;
  const calculation = openErrors.filter((entry) => entry.mistakeType === "Calculation").length;
  const repeatLoad = openErrors.reduce((sum, entry) => sum + entry.repeatCount, 0);

  return (
    <section className="edge-panel rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-edge-muted">Error Book Summary</p>
        <Link className="ghost-button px-3 text-sm" href="/error-book">View all</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-[150px_1fr] xl:grid-cols-1 2xl:grid-cols-[150px_1fr]">
        <div className="grid place-items-center">
          <div className="relative grid h-36 w-36 place-items-center rounded-full" style={{ background: "conic-gradient(#ff4f7b 0 35%, #fbbf24 35% 62%, #22d3ee 62% 85%, #728199 85% 100%)" }}>
            <div className="grid h-24 w-24 place-items-center rounded-full bg-[#071523] text-center">
              <strong className="text-3xl">{total}</strong>
              <span className="-mt-7 text-xs text-edge-muted">Open Errors</span>
            </div>
          </div>
        </div>
        <div className="space-y-3 text-sm text-edge-muted">
          <Legend color="#ff4f7b" label="Conceptual" value={conceptual} />
          <Legend color="#fbbf24" label="Silly Mistake" value={silly} />
          <Legend color="#22d3ee" label="Calculation" value={calculation} />
          <Legend color="#728199" label="Repeat Load" value={repeatLoad} />
          <Link className="ghost-button mt-2 w-full px-3 text-sm" href="/error-book">Open Error Book</Link>
        </div>
      </div>
    </section>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: number }) {
  return <div className="flex items-center justify-between gap-3"><span><i className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: color }} />{label}</span><strong className="text-edge-text">{value}</strong></div>;
}

function ErrorBookPanel({
  state,
  errorForm,
  setErrorForm,
  commitState,
  expanded
}: {
  state: StudyState;
  errorForm: { subject: Subject; topic: string; weakChapter: string; mistakeType: MistakeType; repeatCount: number; repairTask: string; reason: string };
  setErrorForm: (form: { subject: Subject; topic: string; weakChapter: string; mistakeType: MistakeType; repeatCount: number; repairTask: string; reason: string }) => void;
  commitState: (state: StudyState) => void;
  expanded: boolean;
}) {
  const openErrors = state.errorLogs.filter((entry) => !entry.resolved);
  const conceptual = openErrors.filter((entry) => entry.mistakeType === "Conceptual").length;
  const repeatLoad = openErrors.reduce((sum, entry) => sum + entry.repeatCount, 0);

  function addError() {
    if (!errorForm.topic.trim() || !errorForm.reason.trim()) return;
    const entry: ErrorLog = {
      id: crypto.randomUUID(),
      subject: errorForm.subject,
      topic: errorForm.topic.trim(),
      weakChapter: errorForm.weakChapter.trim() || errorForm.topic.trim(),
      mistakeType: errorForm.mistakeType,
      repeatCount: Math.max(1, Number(errorForm.repeatCount || 1)),
      repairTask: errorForm.repairTask.trim() || `Redo ${errorForm.topic.trim()} and write the corrected method.`,
      reason: errorForm.reason.trim(),
      date: todayKey(),
      resolved: false
    };
    commitState({ ...state, errorLogs: [...state.errorLogs, entry] });
    setErrorForm({ subject: "Physics", topic: "", weakChapter: "", mistakeType: "Conceptual", repeatCount: 1, repairTask: "", reason: "" });
  }

  function toggleResolved(entryId: string) {
    commitState({
      ...state,
      errorLogs: state.errorLogs.map((entry) => entry.id === entryId ? { ...entry, resolved: !entry.resolved } : entry)
    });
  }

  return (
    <section className={`edge-panel mt-4 rounded-xl p-5 ${expanded ? "" : "xl:mt-0"}`}>
      <div className="mb-4 flex items-center justify-between"><p className="text-xs font-black uppercase tracking-[0.18em] text-edge-muted">Error Book Summary</p><Link className="ghost-button px-3 text-sm" href="/error-book">View all</Link></div>
      <div className={`grid gap-5 ${expanded ? "xl:grid-cols-[0.8fr_1.2fr]" : "lg:grid-cols-[220px_1fr]"}`}>
        <div className="grid place-items-center">
          <div className="relative grid h-40 w-40 place-items-center rounded-full" style={{ background: `conic-gradient(#ff4f7b 0 38%, #fbbf24 38% 62%, #22d3ee 62% 82%, #728199 82% 100%)` }}>
            <div className="grid h-28 w-28 place-items-center rounded-full bg-[#071523] text-center"><strong className="text-3xl">{openErrors.length}</strong><span className="-mt-8 text-sm text-edge-muted">Open Errors</span></div>
          </div>
        </div>
        <div>
          <div className="mb-3 grid gap-2 text-sm text-edge-muted sm:grid-cols-2">
            <span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-edge-pink" />Conceptual {conceptual}</span>
            <span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-edge-amber" />Repeat load {repeatLoad}</span>
          </div>
          {expanded && (
            <div className="mb-4 grid gap-2 sm:grid-cols-2">
              <select className="input-shell px-3" value={errorForm.subject} onChange={(event) => setErrorForm({ ...errorForm, subject: event.target.value as Subject })}>{subjects.map((subject) => <option key={subject}>{subject}</option>)}</select>
              <select className="input-shell px-3" value={errorForm.mistakeType} onChange={(event) => setErrorForm({ ...errorForm, mistakeType: event.target.value as MistakeType })}>{mistakeTypes.map((type) => <option key={type}>{type}</option>)}</select>
              <input className="input-shell px-3" placeholder="Topic or concept" value={errorForm.topic} onChange={(event) => setErrorForm({ ...errorForm, topic: event.target.value })} />
              <input className="input-shell px-3" placeholder="Weak chapter" value={errorForm.weakChapter} onChange={(event) => setErrorForm({ ...errorForm, weakChapter: event.target.value })} />
              <input className="input-shell px-3" type="number" min="1" max="20" placeholder="Repeat count" value={errorForm.repeatCount} onChange={(event) => setErrorForm({ ...errorForm, repeatCount: Number(event.target.value) })} />
              <input className="input-shell px-3" placeholder="Repair task" value={errorForm.repairTask} onChange={(event) => setErrorForm({ ...errorForm, repairTask: event.target.value })} />
              <textarea className="input-shell min-h-24 px-3 py-2 sm:col-span-2" placeholder="Why did this mistake happen?" value={errorForm.reason} onChange={(event) => setErrorForm({ ...errorForm, reason: event.target.value })} />
              <button className="edge-button px-4 sm:col-span-2" type="button" onClick={addError}>Save mistake</button>
            </div>
          )}
          <div className="space-y-2">
            {state.errorLogs.slice(-6).reverse().map((entry) => (
              <div key={entry.id} className={`rounded-lg border p-3 ${entry.resolved ? "border-edge-line bg-white/[0.02] opacity-65" : "border-edge-line bg-white/[0.035]"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <strong>{entry.topic}</strong>
                    <p className="text-xs text-edge-muted">{entry.subject} | {entry.weakChapter} | {entry.mistakeType} | {entry.repeatCount}x</p>
                  </div>
                  <button className="ghost-button min-h-8 px-3 text-xs" type="button" onClick={() => toggleResolved(entry.id)}>{entry.resolved ? "Reopen" : "Resolve"}</button>
                </div>
                <p className="mt-2 text-sm text-edge-muted">{entry.reason}</p>
                <p className="mt-2 rounded-md border border-edge-line bg-black/15 px-3 py-2 text-xs text-edge-lime">{entry.repairTask}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MockSummary({ latestMock }: { latestMock?: MockTest }) {
  const weak = latestMock ? (["Mathematics", "Physics", "Chemistry"] as Subject[]).sort((a, b) => subjectScore(latestMock, a) - subjectScore(latestMock, b))[0] : undefined;
  return (
    <section className="edge-panel rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between"><p className="text-xs font-black uppercase tracking-[0.18em] text-edge-muted">Mock Test Analytics</p><Link className="ghost-button px-3 text-sm" href="/mocks">View all tests</Link></div>
      {latestMock ? (
        <div className="grid gap-4 md:grid-cols-[190px_1fr]">
          <div className="grid place-items-center rounded-lg border border-edge-line bg-white/[0.035] p-4">
            <span className="text-sm text-edge-muted">Score</span>
            <strong className="text-5xl">{totalMockScore(latestMock)}</strong>
            <span className="text-edge-muted">/ 300</span>
          </div>
          <div className="space-y-3">
            <p><strong>{latestMock.name}</strong><br /><span className="text-sm text-edge-muted">{latestMock.date}</span></p>
            {weak && <p className="rounded-lg border border-edge-line bg-black/15 px-3 py-2 text-xs text-edge-muted">Weakest: <strong className="text-edge-text">{weak}</strong> - {subjectWeakChapter(latestMock, weak)} - {subjectAccuracy(latestMock, weak)}% accuracy</p>}
            <SubjectBar label="Physics" value={latestMock.physics} max={100} color="#22d3ee" detail={`${latestMock.physicsAccuracy}%`} />
            <SubjectBar label="Chemistry" value={latestMock.chemistry} max={100} color="#b7ff3c" detail={`${latestMock.chemistryAccuracy}%`} />
            <SubjectBar label="Mathematics" value={latestMock.math} max={100} color="#ff4f7b" detail={`${latestMock.mathAccuracy}%`} />
          </div>
        </div>
      ) : <p className="text-edge-muted">No mock test logged yet.</p>}
    </section>
  );
}

function MockPanel({
  state,
  mockForm,
  setMockForm,
  commitState,
  expanded
}: {
  state: StudyState;
  mockForm: { name: string; date: string; physics: number; chemistry: number; math: number; physicsAccuracy: number; chemistryAccuracy: number; mathAccuracy: number; physicsWeakChapter: string; chemistryWeakChapter: string; mathWeakChapter: string };
  setMockForm: (form: { name: string; date: string; physics: number; chemistry: number; math: number; physicsAccuracy: number; chemistryAccuracy: number; mathAccuracy: number; physicsWeakChapter: string; chemistryWeakChapter: string; mathWeakChapter: string }) => void;
  commitState: (state: StudyState) => void;
  expanded: boolean;
}) {
  const [repairNotice, setRepairNotice] = useState("");

  function addMock() {
    if (!mockForm.name.trim()) return;
    const mock: MockTest = { ...mockForm, id: crypto.randomUUID() };
    const repairs = buildMockRepairEntries(mock);

    commitState(markStudyActivity({
      ...state,
      mockTests: [...state.mockTests, mock],
      errorLogs: [...state.errorLogs, ...repairs]
    }));
    setRepairNotice(repairs.length ? `Added ${repairs.length} weak-chapter repair task${repairs.length === 1 ? "" : "s"} to Error Book.` : "Mock logged. No weak chapter crossed the repair threshold.");
    setMockForm({ name: "", date: todayKey(), physics: 0, chemistry: 0, math: 0, physicsAccuracy: 70, chemistryAccuracy: 70, mathAccuracy: 70, physicsWeakChapter: "", chemistryWeakChapter: "", mathWeakChapter: "" });
  }

  return (
    <section className="edge-panel mt-4 rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between"><p className="text-xs font-black uppercase tracking-[0.18em] text-edge-muted">Mock Tests</p><Trophy className="text-edge-amber" /></div>
      {expanded && (
        <div className="mb-5 grid gap-2 md:grid-cols-6">
          <input className="input-shell px-3 md:col-span-2" placeholder="Test name" value={mockForm.name} onChange={(event) => setMockForm({ ...mockForm, name: event.target.value })} />
          <input className="input-shell px-3" type="date" value={mockForm.date} onChange={(event) => setMockForm({ ...mockForm, date: event.target.value })} />
          <input className="input-shell px-3" type="number" min="0" max="100" placeholder="Physics marks" value={mockForm.physics} onChange={(event) => setMockForm({ ...mockForm, physics: Number(event.target.value) })} />
          <input className="input-shell px-3" type="number" min="0" max="100" placeholder="Chem marks" value={mockForm.chemistry} onChange={(event) => setMockForm({ ...mockForm, chemistry: Number(event.target.value) })} />
          <input className="input-shell px-3" type="number" min="0" max="100" placeholder="Math marks" value={mockForm.math} onChange={(event) => setMockForm({ ...mockForm, math: Number(event.target.value) })} />
          <input className="input-shell px-3" type="number" min="0" max="100" placeholder="Physics accuracy" value={mockForm.physicsAccuracy} onChange={(event) => setMockForm({ ...mockForm, physicsAccuracy: Number(event.target.value) })} />
          <input className="input-shell px-3" type="number" min="0" max="100" placeholder="Chem accuracy" value={mockForm.chemistryAccuracy} onChange={(event) => setMockForm({ ...mockForm, chemistryAccuracy: Number(event.target.value) })} />
          <input className="input-shell px-3" type="number" min="0" max="100" placeholder="Math accuracy" value={mockForm.mathAccuracy} onChange={(event) => setMockForm({ ...mockForm, mathAccuracy: Number(event.target.value) })} />
          <input className="input-shell px-3 md:col-span-2" placeholder="Physics weak chapter" value={mockForm.physicsWeakChapter} onChange={(event) => setMockForm({ ...mockForm, physicsWeakChapter: event.target.value })} />
          <input className="input-shell px-3 md:col-span-2" placeholder="Chemistry weak chapter" value={mockForm.chemistryWeakChapter} onChange={(event) => setMockForm({ ...mockForm, chemistryWeakChapter: event.target.value })} />
          <input className="input-shell px-3 md:col-span-2" placeholder="Math weak chapter" value={mockForm.mathWeakChapter} onChange={(event) => setMockForm({ ...mockForm, mathWeakChapter: event.target.value })} />
          <button className="edge-button px-4 md:col-span-6" type="button" onClick={addMock}>Log test</button>
          {repairNotice && <p className="rounded-lg border border-edge-line bg-black/15 p-3 text-sm text-edge-muted md:col-span-6">{repairNotice}</p>}
        </div>
      )}
      <div className="grid gap-3 lg:grid-cols-2">
        {state.mockTests.slice(-4).reverse().map((mock) => (
          <div key={mock.id} className="rounded-lg border border-edge-line bg-white/[0.035] p-4">
            <div className="mb-3 flex items-center justify-between"><strong>{mock.name}</strong><span className="text-sm text-edge-muted">{totalMockScore(mock)} / 300</span></div>
            <SubjectBar label={`P - ${mock.physicsWeakChapter || "Mixed"}`} value={mock.physics} max={100} color="#22d3ee" detail={`${mock.physicsAccuracy}%`} />
            <SubjectBar label={`C - ${mock.chemistryWeakChapter || "Mixed"}`} value={mock.chemistry} max={100} color="#b7ff3c" detail={`${mock.chemistryAccuracy}%`} />
            <SubjectBar label={`M - ${mock.mathWeakChapter || "Mixed"}`} value={mock.math} max={100} color="#ff4f7b" detail={`${mock.mathAccuracy}%`} />
          </div>
        ))}
      </div>
    </section>
  );
}

function SubjectBar({ label, value, max, color, detail }: { label: string; value: number; max: number; color: string; detail?: string }) {
  return (
    <div className="mt-2 grid grid-cols-[minmax(88px,1fr)_1fr_58px] items-center gap-3 text-sm">
      <span className="truncate text-edge-muted">{label}</span>
      <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }} /></div>
      <strong>{value}{detail ? <span className="block text-[0.65rem] text-edge-muted">{detail}</span> : null}</strong>
    </div>
  );
}

function TimerPanel({
  timerSeconds,
  timerRunning,
  activeSession,
  setTimerRunning,
  setTimerSeconds
}: {
  timerSeconds: number;
  timerRunning: boolean;
  activeSession: ActiveSession | null;
  setTimerRunning: (running: boolean) => void;
  setTimerSeconds: (seconds: number) => void;
}) {
  const progress = ((25 * 60 - timerSeconds) / (25 * 60)) * 100;
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  return (
    <section className="edge-panel rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between"><p className="text-xs font-black uppercase tracking-[0.18em] text-edge-muted">Pomodoro & Session Tracker</p><span className="text-xs text-edge-muted">25 min focus</span></div>
      <div className="grid place-items-center">
        <div className="mb-4 w-full rounded-lg border border-edge-line bg-black/15 p-3 text-center">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-edge-muted">{activeSession?.source || "Manual session"}</p>
          <strong className="mt-1 block">{activeSession?.topic || "Pick a planner block or start a manual focus session"}</strong>
          {activeSession?.subject && <p className="mt-1 text-sm text-edge-muted">{activeSession.subject}</p>}
        </div>
        <div className="relative grid h-52 w-52 place-items-center rounded-full" style={{ background: `conic-gradient(#b7ff3c 0 ${progress}%, rgba(255,255,255,0.08) ${progress}% 100%)` }}>
          <div className="grid h-40 w-40 place-items-center rounded-full bg-[#071523] text-center">
            <strong className="text-5xl">{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</strong>
            <span className="-mt-8 text-sm text-edge-muted">Focus Time</span>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="ghost-button px-5" type="button" onClick={() => setTimerRunning(!timerRunning)}>{timerRunning ? <Pause size={17} /> : <Play size={17} />}</button>
          <button className="ghost-button px-5" type="button" onClick={() => { setTimerRunning(false); setTimerSeconds(25 * 60); }}><TimerReset size={17} /></button>
        </div>
      </div>
    </section>
  );
}

function ScratchpadPanel({ state, commitState }: { state: StudyState; commitState: (state: StudyState) => void }) {
  return (
    <section id="scratchpad" className="edge-panel scroll-mt-24 rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between"><p className="text-xs font-black uppercase tracking-[0.18em] text-edge-muted">Scratchpad / Formula Pin</p><BookMarked className="text-edge-muted" size={18} /></div>
      <textarea
        className="input-shell min-h-[220px] resize-none px-3 py-3 font-mono text-sm leading-6 text-edge-lime"
        value={state.scratchpad}
        onChange={(event) => commitState({ ...state, scratchpad: event.target.value })}
      />
      <div className="mt-3 flex justify-end gap-2"><button className="ghost-button px-4" type="button" onClick={() => commitState({ ...state, scratchpad: "" })}>Clear</button><button className="ghost-button px-4" type="button" onClick={() => commitState({ ...state })}><Save size={16} /> Save Note</button></div>
    </section>
  );
}

function UpcomingPanel({
  state,
  actionItems,
  commitState
}: {
  state: StudyState;
  actionItems: StudyActionItem[];
  commitState: (state: StudyState) => void;
}) {
  const items = actionItems.filter((item) => !item.completed);

  function completeAction(item: StudyActionItem) {
    if (item.kind === "revision" && item.revisionId) {
      commitState(markStudyActivity({ ...state, revisionDone: { ...state.revisionDone, [item.revisionId]: true } }));
      return;
    }

    if (item.kind === "mistake-repair" && item.errorId) {
      commitState(markStudyActivity({
        ...state,
        errorLogs: state.errorLogs.map((entry) => entry.id === item.errorId ? { ...entry, resolved: true } : entry)
      }));
      return;
    }

    if (item.kind === "mock-repair") {
      const sourceMock = state.mockTests.find((mock) => mock.id === item.mockId);
      const weakChapter = item.title.replace(/^Mock repair:\s*/, "").trim() || item.detail;
      const entry: ErrorLog = {
        id: crypto.randomUUID(),
        subject: item.subject,
        topic: weakChapter,
        weakChapter,
        mistakeType: "Conceptual",
        repeatCount: 1,
        repairTask: item.action,
        reason: `Created from ${sourceMock?.name || "mock test"}: ${item.detail}.`,
        date: todayKey(),
        resolved: false
      };
      commitState(markStudyActivity({ ...state, errorLogs: [...state.errorLogs, entry] }));
    }
  }

  return (
    <section id="action-queue" className="edge-panel scroll-mt-24 rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-edge-muted">Action Queue</p>
          <p className="mt-1 text-sm text-edge-muted">Mistakes, mock weak chapters, and revision dates.</p>
        </div>
        <CalendarDays className="text-edge-pink" size={18} />
      </div>
      <div className="max-h-[620px] space-y-2 overflow-y-auto pr-1 thin-scrollbar">
        {items.length ? items.map((item) => (
          <div key={item.id} className="rounded-lg border border-edge-line bg-white/[0.035] p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: item.color }}>{item.subject}</span>
                <strong className="mt-1 block">{item.title}</strong>
                <p className="mt-1 text-xs text-edge-muted">{item.sourceLabel} | {item.status === "overdue" ? `Overdue since ${item.dueDate}` : item.status === "today" ? "Due today" : `Due ${item.dueDate}`}</p>
                <p className="mt-2 text-sm leading-6 text-edge-muted">{item.detail}</p>
                <p className="mt-2 rounded-md border border-edge-line bg-black/15 px-3 py-2 text-xs text-edge-lime">{item.action}</p>
              </div>
              <button className="ghost-button min-h-8 px-3 text-xs" type="button" onClick={() => completeAction(item)}>
                {item.kind === "mock-repair" ? "Add repair" : item.kind === "mistake-repair" ? "Resolve" : "Done"}
              </button>
            </div>
          </div>
        )) : (
          <div className="rounded-lg border border-edge-line bg-white/[0.035] p-4">
            <strong>No actions waiting</strong>
            <p className="mt-1 text-sm text-edge-muted">Complete a syllabus topic, log a mistake, or add a mock weak chapter to create dated actions.</p>
          </div>
        )}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Link className="ghost-button px-3 text-xs" href="/syllabus">Complete topics</Link>
        <Link className="ghost-button px-3 text-xs" href="/mocks">Log mock</Link>
        <Link className="ghost-button px-3 text-xs" href="/error-book">Open errors</Link>
      </div>
    </section>
  );
}

function SyllabusPanel({ state, commitState, expanded }: { state: StudyState; commitState: (state: StudyState) => void; expanded: boolean }) {
  const [selectedTopicId, setSelectedTopicId] = useState(syllabusTopics[0]?.id || "");
  const selectedTopic = syllabusTopics.find((topic) => topic.id === selectedTopicId) || syllabusTopics[0];
  const selectedGuide = selectedTopic ? chapterGuideForTopic(selectedTopic) : null;

  function toggleTopic(topicId: string) {
    const done = Boolean(state.completedTopics[topicId]);
    const completedTopics = { ...state.completedTopics, [topicId]: !done };
    const completedAt = { ...state.completedAt };
    const revisionDone = { ...state.revisionDone };

    if (done) {
      delete completedAt[topicId];
      delete revisionDone[revisionTaskKey(topicId, "1-day")];
      delete revisionDone[revisionTaskKey(topicId, "7-day")];
      delete revisionDone[revisionTaskKey(topicId, "21-day")];
    } else {
      completedAt[topicId] = todayKey();
      revisionDone[revisionTaskKey(topicId, "1-day")] = false;
      revisionDone[revisionTaskKey(topicId, "7-day")] = false;
      revisionDone[revisionTaskKey(topicId, "21-day")] = false;
    }

    const next = {
      ...state,
      completedTopics,
      completedAt,
      revisionDone,
      confidence: { ...state.confidence, [topicId]: done ? 40 : Math.max(70, state.confidence[topicId] || 70) }
    };

    commitState(done ? next : markStudyActivity(next));
  }

  function updateConfidence(topicId: string, confidence: number) {
    commitState({
      ...state,
      confidence: { ...state.confidence, [topicId]: Math.max(0, Math.min(100, confidence)) }
    });
  }

  function addRepairFromTopic(topic: Topic) {
    const hasOpenRepair = state.errorLogs.some((entry) => (
      !entry.resolved &&
      entry.subject === topic.subject &&
      (entry.weakChapter || entry.topic).trim().toLowerCase() === topic.title.toLowerCase()
    ));
    if (hasOpenRepair) return;

    const entry: ErrorLog = {
      id: crypto.randomUUID(),
      subject: topic.subject,
      topic: topic.title,
      weakChapter: topic.title,
      mistakeType: "Conceptual",
      repeatCount: 1,
      repairTask: `Repair ${topic.title}: revise formulas/traps, solve 15 targeted questions, and write one correction note.`,
      reason: `Added from chapter detail view for ${topic.title}.`,
      date: todayKey(),
      resolved: false
    };
    commitState(markStudyActivity({ ...state, errorLogs: [...state.errorLogs, entry] }));
  }

  return (
    <section className="edge-panel mt-4 rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between"><p className="text-xs font-black uppercase tracking-[0.18em] text-edge-muted">Syllabus Tracker</p><Zap className="text-edge-lime" /></div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        {selectedTopic && selectedGuide ? (
          <ChapterDetailPanel
            topic={selectedTopic}
            guide={selectedGuide}
            state={state}
            toggleTopic={toggleTopic}
            addRepairFromTopic={addRepairFromTopic}
          />
        ) : null}
        <div className={`grid gap-3 xl:order-1 ${expanded ? "lg:grid-cols-2 2xl:grid-cols-3" : "lg:grid-cols-5"}`}>
          {syllabusTopics.map((topic) => {
            const done = Boolean(state.completedTopics[topic.id]);
            const selected = topic.id === selectedTopic?.id;
            const meta = subjectMeta[topic.subject];
            const confidence = state.confidence[topic.id] || 0;
            return (
              <article
                key={topic.id}
                className={`rounded-lg border p-4 transition hover:-translate-y-0.5 ${
                  selected ? "border-edge-cyan bg-edge-cyan/10" : done ? "border-edge-lime bg-edge-lime/10" : "border-edge-line bg-white/[0.035]"
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: meta.color }}>{topic.subject}</span>
                  <button
                    className={`grid h-8 w-8 place-items-center rounded-full border ${done ? "border-edge-lime bg-edge-lime text-[#071014]" : "border-edge-line text-edge-muted"}`}
                    type="button"
                    aria-label={done ? `Reopen ${topic.title}` : `Complete ${topic.title}`}
                    onClick={() => toggleTopic(topic.id)}
                  >
                    {done ? <Check size={16} /> : null}
                  </button>
                </div>
                <strong>{topic.title}</strong>
                <p className="mt-2 text-sm text-edge-muted">{topic.track} | {topic.priority}</p>
                <label className="mt-3 grid gap-2 text-xs text-edge-muted">
                  <span className="flex items-center justify-between gap-3">
                    Confidence
                    <span className="flex items-center gap-2">
                      <input
                        className="input-shell h-8 w-20 px-2 text-right text-xs"
                        type="number"
                        min="0"
                        max="100"
                        step="5"
                        aria-label={`${topic.title} confidence`}
                        value={confidence}
                        onChange={(event) => updateConfidence(topic.id, Number(event.target.value))}
                      />
                      <strong className="text-edge-text">%</strong>
                    </span>
                  </span>
                  <input
                    className="accent-edge-lime"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={confidence}
                    onChange={(event) => updateConfidence(topic.id, Number(event.target.value))}
                  />
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="ghost-button min-h-8 px-3 text-xs" type="button" onClick={() => setSelectedTopicId(topic.id)}>Details</button>
                  <button className="ghost-button min-h-8 px-3 text-xs" type="button" onClick={() => addRepairFromTopic(topic)}>Repair</button>
                </div>
                {done && state.completedAt[topic.id] ? <p className="mt-2 text-xs text-edge-muted">Completed {state.completedAt[topic.id]}</p> : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ChapterDetailPanel({
  topic,
  guide,
  state,
  toggleTopic,
  addRepairFromTopic
}: {
  topic: Topic;
  guide: ChapterGuide;
  state: StudyState;
  toggleTopic: (topicId: string) => void;
  addRepairFromTopic: (topic: Topic) => void;
}) {
  const done = Boolean(state.completedTopics[topic.id]);
  const confidence = state.confidence[topic.id] || 0;
  const meta = subjectMeta[topic.subject];

  return (
    <aside id="chapter-detail" className="rounded-xl border border-edge-line bg-black/20 p-4 xl:order-2 xl:sticky xl:top-24 xl:self-start">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.14em]" style={{ color: meta.color }}>{topic.subject}</span>
          <h2 className="mt-2 text-2xl font-black leading-tight">{topic.title}</h2>
          <p className="mt-1 text-sm text-edge-muted">{topic.unit} | {topic.track} | {topic.priority} priority</p>
        </div>
        <span className="rounded-full border border-edge-line px-3 py-1 text-xs font-bold text-edge-muted">{confidence}% confidence</span>
      </div>

      <div className="grid gap-3">
        <GuideList title="Formulas / recall card" items={guide.formulas} />
        <GuideList title="Common traps" items={guide.traps} />
        <GuideList title="Repair notes" items={guide.repairNotes} />
        <GuideList title="Safe guidance" items={guide.guidance} />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        <button className="edge-button px-4" type="button" onClick={() => toggleTopic(topic.id)}>
          {done ? "Reopen chapter" : "Mark complete"}
        </button>
        <button className="ghost-button px-4" type="button" onClick={() => addRepairFromTopic(topic)}>Add repair action</button>
        <Link className="ghost-button px-4" href="/planner">Use in planner</Link>
        <Link className="ghost-button px-4" href="/error-book">Open Error Book</Link>
      </div>

      <p className="mt-4 rounded-lg border border-edge-line bg-white/[0.035] p-3 text-xs leading-5 text-edge-muted">
        When you mark this complete, the app creates 1-day, 7-day, and 21-day revision actions from the completion date.
      </p>
    </aside>
  );
}

function GuideList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-edge-line bg-white/[0.035] p-3">
      <h3 className="text-xs font-black uppercase tracking-[0.14em] text-edge-muted">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-edge-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-edge-lime" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SettingsPanel({
  state,
  user,
  hasLegacy,
  syncStatus,
  commitState,
  signOut
}: {
  state: StudyState;
  user: UserState | null;
  hasLegacy: boolean;
  syncStatus: string;
  commitState: (state: StudyState) => void;
  signOut: () => void;
}) {
  return (
    <section className="edge-panel rounded-xl p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-edge-muted">Settings</p>
      <h2 className="mt-1 text-2xl font-black">Account and migration</h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-edge-line bg-white/[0.035] p-4">
          <UserCircle2 className="mb-3 text-edge-lime" />
          <strong>{user?.name || "Student"}</strong>
          <p className="mt-1 text-sm text-edge-muted">{user?.demo ? "Local demo account" : user?.email}</p>
          <p className="mt-3 text-sm text-edge-muted">{syncStatus}</p>
          <button className="ghost-button mt-4 px-4" type="button" onClick={signOut}><LogOut size={16} /> Sign out</button>
        </div>
        <div className="rounded-lg border border-edge-line bg-white/[0.035] p-4">
          <Sparkles className="mb-3 text-edge-cyan" />
          <strong>Import old browser progress</strong>
          <p className="mt-1 text-sm leading-6 text-edge-muted">This checks the old single-file dashboard keys and merges them into the new web-app state.</p>
          <button className="edge-button mt-4 px-4 disabled:opacity-50" type="button" disabled={!hasLegacy} onClick={() => commitState(importLegacyProgress(state))}>
            {hasLegacy ? "Import this browser's old progress" : "No legacy data found"}
          </button>
        </div>
      </div>
      <div className="mt-5 rounded-lg border border-edge-line bg-black/20 p-4">
        <strong>Trust-first roadmap</strong>
        <p className="mt-2 text-sm leading-6 text-edge-muted">Keep the core free and useful first. Later paid ideas should be optional analytics, revision calendars, downloadable sheets, personal planner templates, or trusted affiliate resources.</p>
      </div>
    </section>
  );
}
