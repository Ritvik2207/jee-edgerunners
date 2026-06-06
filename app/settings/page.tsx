import type { Metadata } from "next";
import { StudyApp } from "@/components/study-app";

export const metadata: Metadata = {
  title: "JEE Edgerunners Settings",
  description: "Manage local demo mode, optional account sync, and browser progress import for JEE Edgerunners.",
  alternates: {
    canonical: "/settings"
  },
  openGraph: {
    title: "JEE Edgerunners Settings",
    description: "Manage account sync and import browser progress.",
    url: "/settings",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "JEE Edgerunners Settings",
    description: "Manage account sync and import browser progress."
  }
};

export default function SettingsPage() {
  return <StudyApp initialView="settings" />;
}
