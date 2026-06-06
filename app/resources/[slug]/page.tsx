import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getResourceArticle, resourceArticles, resourcePath, resourceUrl } from "@/lib/resource-content";
import { absoluteUrl, routeTitle, siteName } from "@/lib/site";

type ResourcePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return resourceArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getResourceArticle(slug);
  if (!article) return {};

  return {
    title: routeTitle(article.title),
    description: article.description,
    alternates: {
      canonical: resourcePath(article.slug)
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: resourcePath(article.slug),
      siteName,
      type: "article",
      publishedTime: article.updatedAt,
      modifiedTime: article.updatedAt,
      tags: article.keywords
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description
    },
    keywords: article.keywords
  };
}

export default async function ResourceArticlePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const article = getResourceArticle(slug);
  if (!article) notFound();

  const related = article.relatedSlugs
    .map((relatedSlug) => getResourceArticle(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.updatedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: siteName,
      url: absoluteUrl("/")
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: absoluteUrl("/")
    },
    mainEntityOfPage: resourceUrl(article.slug),
    keywords: article.keywords.join(", ")
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <article className="mx-auto max-w-4xl py-8 sm:py-12">
        <Link className="ghost-button mb-8 px-4 text-sm" href="/resources">
          <ArrowLeft size={17} /> Resources
        </Link>

        <header className="edge-panel rounded-xl p-5 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-edge-lime">JEE Main Resource</p>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">{article.title}</h1>
          <p className="mt-5 text-lg leading-8 text-edge-muted">{article.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {article.keywords.map((keyword) => (
              <span key={keyword} className="rounded-full border border-edge-line bg-black/20 px-3 py-1 text-xs text-edge-muted">{keyword}</span>
            ))}
          </div>
        </header>

        <div className="mt-6 space-y-5">
          {article.sections.map((section) => (
            <section key={section.heading} className="edge-panel rounded-xl p-5 sm:p-7">
              <h2 className="text-2xl font-black">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-edge-muted">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="edge-panel mt-6 rounded-xl p-5 sm:p-7">
          <h2 className="text-2xl font-black">FAQ</h2>
          <div className="mt-4 grid gap-3">
            {article.faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border border-edge-line bg-white/[0.035] p-4">
                <h3 className="font-black">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-edge-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="edge-panel mt-6 rounded-xl p-5 sm:p-7">
          <h2 className="text-2xl font-black">Use this with JEE Edgerunners</h2>
          <p className="mt-3 text-edge-muted">Turn the guide into action using the dashboard tools.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link className="edge-button px-4" href="/dashboard">Open dashboard <ArrowRight size={17} /></Link>
            <Link className="ghost-button px-4" href="/planner">Build today&apos;s plan</Link>
            <Link className="ghost-button px-4" href="/mocks">Analyze mocks</Link>
            <Link className="ghost-button px-4" href="/error-book">Repair mistakes</Link>
          </div>
        </section>

        {related.length ? (
          <section className="mt-6">
            <h2 className="mb-3 text-xl font-black">Related guides</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.slug} className="edge-panel rounded-xl p-4 transition hover:border-edge-cyan" href={resourcePath(item.slug)}>
                  <strong>{item.title}</strong>
                  <span className="mt-2 block text-sm leading-6 text-edge-muted">{item.description}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
