import type { Metadata } from "next";
import { StudyApp } from "@/components/study-app";

export const metadata: Metadata = {
  title: "JEE Main Mock Test Analysis",
  description: "Track JEE Main mock test scores, subject accuracy, weak chapters, and repair tasks.",
  alternates: {
    canonical: "/mocks"
  },
  openGraph: {
    title: "JEE Main Mock Test Analysis",
    description: "Analyze mock scores, accuracy, and weak chapters for the next repair plan.",
    url: "/mocks",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "JEE Main Mock Test Analysis",
    description: "Analyze mock scores, accuracy, and weak chapters for the next repair plan."
  }
};

export default function MocksPage() {
  return <StudyApp initialView="mocks" />;
}
