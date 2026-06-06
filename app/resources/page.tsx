import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, CalendarDays, ClipboardList, NotebookPen, Target } from "lucide-react";
import { resourceArticles, resourcePath } from "@/lib/resource-content";
import { absoluteUrl, routeTitle, siteDescription, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: routeTitle("JEE Main Resources"),
  description: "Original JEE Main PCM planning, revision, mock analysis, formula, and error-book guides for drop-year students.",
  alternates: {
    canonical: "/resources"
  },
  openGraph: {
    title: "JEE Main Resources | JEE Edgerunners",
    description: "Free original guides for daily planning, revision, mocks, formulas, and mistake repair.",
    url: "/resources",
    siteName,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "JEE Main Resources | JEE Edgerunners",
    description: "Free original guides for daily planning, revision, mocks, formulas, and mistake repair."
  },
  keywords: [
    "JEE Main resources",
    "JEE Main planner",
    "JEE revision schedule",
    "JEE mock test analysis",
    "drop year PCM"
  ]
};

const toolLinks = [
  { href: "/dashboard", label: "Dashboard", icon: BookOpenCheck },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/syllabus", label: "Syllabus", icon: ClipboardList },
  { href: "/mocks", label: "Mocks", icon: Target },
  { href: "/error-book", label: "Error Book", icon: NotebookPen }
];

export default function ResourcesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "JEE Main Resources",
    description: metadata.description,
    url: absoluteUrl("/resources"),
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: absoluteUrl("/")
    },
    hasPart: resourceArticles.map((article) => ({
      "@type": "Article",
      headline: article.title,
      description: article.description,
      url: absoluteUrl(resourcePath(article.slug)),
      dateModified: article.updatedAt
    }))
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto max-w-6xl py-10 sm:py-16">
        <nav className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link className="text-2xl font-black italic tracking-tight" href="/">
            JEE <span className="text-edge-lime">EDGERUNNERS</span>
          </Link>
          <div className="flex flex-wrap gap-2">
            <Link className="ghost-button px-4 text-sm" href="/dashboard">Open dashboard</Link>
            <Link className="edge-button px-4 text-sm" href="/planner">Build plan</Link>
          </div>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-edge-lime">Free JEE Main Guides</p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-edge-text sm:text-6xl">
              Study systems for planning, revision, mocks, and mistake repair.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-edge-muted">{siteDescription}</p>
          </div>
          <div className="edge-panel rounded-xl p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-edge-muted">Use with the app</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {toolLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} className="rounded-lg border border-edge-line bg-white/[0.035] p-3 text-sm font-bold transition hover:border-edge-cyan hover:bg-edge-cyan/10" href={item.href}>
                    <Icon className="mb-2 text-edge-cyan" size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resourceArticles.map((article) => (
            <article key={article.slug} className="edge-panel rounded-xl p-5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-edge-muted">Updated {article.updatedAt}</p>
              <h2 className="mt-3 text-xl font-black leading-tight">{article.title}</h2>
              <p className="mt-3 text-sm leading-6 text-edge-muted">{article.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {article.keywords.slice(0, 3).map((keyword) => (
                  <span key={keyword} className="rounded-full border border-edge-line bg-black/15 px-3 py-1 text-xs text-edge-muted">{keyword}</span>
                ))}
              </div>
              <Link className="edge-button mt-5 w-full px-4" href={resourcePath(article.slug)}>
                Read guide <ArrowRight size={17} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
