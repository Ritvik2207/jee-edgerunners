import type { Metadata } from "next";
import { StudyApp } from "@/components/study-app";

export const metadata: Metadata = {
  title: "JEE Main Study Dashboard",
  description: "Open the JEE Edgerunners dashboard for daily PCM planning, syllabus progress, revision, mock analysis, and mistake repair.",
  alternates: {
    canonical: "/dashboard"
  },
  openGraph: {
    title: "JEE Main Study Dashboard",
    description: "Plan daily study, track syllabus progress, analyze mocks, and repair mistakes.",
    url: "/dashboard",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "JEE Main Study Dashboard",
    description: "Plan daily study, track syllabus progress, analyze mocks, and repair mistakes."
  }
};

export default function DashboardPage() {
  return <StudyApp initialView="dashboard" />;
}
