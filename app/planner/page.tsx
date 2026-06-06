import type { Metadata } from "next";
import { StudyApp } from "@/components/study-app";

export const metadata: Metadata = {
  title: "JEE Main Daily PCM Planner",
  description: "Build a daily Physics, Chemistry, Mathematics, and revision plan from hours, weak chapters, mocks, and mistakes.",
  alternates: {
    canonical: "/planner"
  },
  openGraph: {
    title: "JEE Main Daily PCM Planner",
    description: "Create a practical daily JEE Main PCM study plan with revision and repair blocks.",
    url: "/planner",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "JEE Main Daily PCM Planner",
    description: "Create a practical daily JEE Main PCM study plan with revision and repair blocks."
  }
};

export default function PlannerPage() {
  return <StudyApp initialView="planner" />;
}
