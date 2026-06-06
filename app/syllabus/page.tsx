import type { Metadata } from "next";
import { StudyApp } from "@/components/study-app";

export const metadata: Metadata = {
  title: "JEE Main Syllabus Tracker",
  description: "Track JEE Main PCM syllabus completion, confidence, and revision dates by chapter.",
  alternates: {
    canonical: "/syllabus"
  },
  openGraph: {
    title: "JEE Main Syllabus Tracker",
    description: "Track PCM syllabus progress and chapter confidence for JEE Main preparation.",
    url: "/syllabus",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "JEE Main Syllabus Tracker",
    description: "Track PCM syllabus progress and chapter confidence for JEE Main preparation."
  }
};

export default function SyllabusPage() {
  return <StudyApp initialView="syllabus" />;
}
