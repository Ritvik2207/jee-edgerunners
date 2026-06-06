import type { Metadata } from "next";
import { StudyApp } from "@/components/study-app";

export const metadata: Metadata = {
  title: "JEE Main Error Book",
  description: "Log JEE Main mistakes by subject, weak chapter, mistake type, repeat count, and repair task.",
  alternates: {
    canonical: "/error-book"
  },
  openGraph: {
    title: "JEE Main Error Book",
    description: "Turn repeated mistakes into repair tasks for Physics, Chemistry, and Mathematics.",
    url: "/error-book",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "JEE Main Error Book",
    description: "Turn repeated mistakes into repair tasks for Physics, Chemistry, and Mathematics."
  }
};

export default function ErrorBookPage() {
  return <StudyApp initialView="error-book" />;
}
