import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Database, ShieldCheck, Sparkles } from "lucide-react";
import { absoluteUrl, routeTitle, siteDescription, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: routeTitle("Free JEE Main PCM Study Planner"),
  description: siteDescription,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "JEE Edgerunners - Free JEE Main PCM Study Planner",
    description: siteDescription,
    url: "/",
    siteName,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "JEE Edgerunners - Free JEE Main PCM Study Planner",
    description: siteDescription
  }
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: siteName,
        url: absoluteUrl("/"),
        description: siteDescription,
        potentialAction: {
          "@type": "SearchAction",
          target: `${absoluteUrl("/resources")}?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebApplication",
        name: siteName,
        url: absoluteUrl("/dashboard"),
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        description: siteDescription,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR"
        }
      }
    ]
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.26em] text-edge-lime">JEE Main | PCM Drop-Year</p>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-edge-text sm:text-7xl">
            JEE Edgerunners
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-edge-muted">
            A real web dashboard for daily PCM planning, syllabus progress, error repair, mock analytics, and focused study sessions.
            Sign in support is wired for Supabase, with a local demo mode while setup is incomplete.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="edge-button px-5" href="/dashboard">
              Open dashboard <ArrowRight size={18} />
            </Link>
            <Link className="ghost-button px-5" href="/resources">
              Free resources <BookOpen size={18} />
            </Link>
            <Link className="ghost-button px-5" href="/settings">
              Setup account saving
            </Link>
          </div>
        </div>

        <div className="edge-panel rounded-xl p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-edge-muted">App foundation</p>
              <h2 className="mt-1 text-2xl font-black">Built to grow</h2>
            </div>
            <Sparkles className="text-edge-lime" />
          </div>
          <div className="grid gap-3">
            {[
              ["Accounts", "Email/password and Google sign-in through Supabase.", ShieldCheck],
              ["Online data", "Progress, planner, mocks, mistakes, and notes are database-ready.", Database],
              ["Useful first", "Monetization and AI stay behind the core planner, revision, mocks, and repair workflow.", Sparkles]
            ].map(([title, text, Icon]) => (
              <div key={title as string} className="rounded-lg border border-edge-line bg-white/[0.035] p-4">
                <div className="mb-2 flex items-center gap-3">
                  <Icon className="text-edge-cyan" size={19} />
                  <strong>{title as string}</strong>
                </div>
                <p className="text-sm leading-6 text-edge-muted">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
