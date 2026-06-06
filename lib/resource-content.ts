import { absoluteUrl } from "@/lib/site";

export type ResourceSection = {
  heading: string;
  body: string[];
};

export type ResourceFaq = {
  question: string;
  answer: string;
};

export type ResourceAppAction = {
  label: string;
  href: string;
  description: string;
};

export type ResourceArticle = {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  keywords: string[];
  sections: ResourceSection[];
  faqs: ResourceFaq[];
  appActions: ResourceAppAction[];
  relatedSlugs: string[];
};

export const resourceArticles: ResourceArticle[] = [
  {
    slug: "jee-main-daily-study-planner",
    title: "How to Build a Daily JEE Main PCM Study Planner",
    description:
      "A simple daily planning method for drop-year PCM students: choose hours, split Physics, Chemistry, Maths, and keep one repair block.",
    updatedAt: "2026-06-06",
    keywords: ["JEE Main daily planner", "PCM study planner", "drop year study plan", "JEE timetable"],
    sections: [
      {
        heading: "Start with today, not the whole year",
        body: [
          "A useful JEE plan starts with the hours you actually have today. Write the number first, then split it into three subject blocks and one revision or repair block.",
          "The goal is not to make a perfect timetable. The goal is to make a plan you can finish and learn from before tomorrow."
        ]
      },
      {
        heading: "Use weak areas to decide the split",
        body: [
          "A balanced PCM split is fine when you have no data. Once you have mock scores, incomplete chapters, and mistakes, the weaker subject should get the sharper task.",
          "For example, if Maths accuracy is low because of Integral Calculus, the Maths block should say exactly that instead of just saying Maths practice."
        ]
      },
      {
        heading: "End with a repair note",
        body: [
          "After each block, write one line: what improved, what broke, and what needs repair. This keeps tomorrow's plan connected to real evidence.",
          "JEE Edgerunners uses this idea inside the planner, error book, and mock analysis flow."
        ]
      }
    ],
    faqs: [
      {
        question: "How many hours should a drop-year JEE student study daily?",
        answer:
          "Use the number of focused hours you can repeat. A consistent 5 to 7 focused hours with review is usually more useful than one extreme day followed by burnout."
      },
      {
        question: "Should Physics, Chemistry, and Maths get equal time every day?",
        answer:
          "Start balanced, then adjust based on weak chapters, mock accuracy, and unresolved mistakes."
      }
    ],
    appActions: [
      { label: "Build today's smart plan", href: "/planner", description: "Enter today's study hours and let weak areas shape the PCM split." },
      { label: "Add a weak chapter", href: "/error-book", description: "Log one unresolved mistake so the planner has real repair data." },
      { label: "Check action queue", href: "/dashboard#action-queue", description: "Review dated repair and revision actions before starting." }
    ],
    relatedSlugs: ["jee-main-revision-schedule", "jee-main-mock-test-analysis", "drop-year-pcm-study-system"]
  },
  {
    slug: "jee-main-revision-schedule",
    title: "A Practical 1-7-21 Day Revision Schedule for JEE Main",
    description:
      "Use a simple 1-day, 7-day, and 21-day revision rhythm after completing each JEE Main chapter.",
    updatedAt: "2026-06-06",
    keywords: ["JEE revision schedule", "spaced revision JEE", "JEE Main revision planner"],
    sections: [
      {
        heading: "Revision should be scheduled when a chapter is completed",
        body: [
          "Do not wait for a giant revision month. When you finish a chapter, immediately create three review points: after 1 day, after 7 days, and after 21 days.",
          "Each review should start with active recall before reading notes again."
        ]
      },
      {
        heading: "What to do in each revision",
        body: [
          "The 1-day review checks whether the main formulas and steps stayed in memory. The 7-day review checks mixed problems. The 21-day review checks whether the chapter survives exam-style pressure.",
          "Keep each revision short but real: recall, solve, correct, and mark confidence."
        ]
      },
      {
        heading: "Connect revision to mistakes",
        body: [
          "If a revision exposes a repeated mistake, move that mistake into the error book instead of pretending the chapter is done.",
          "A revision calendar is useful only when it changes what you repair next."
        ]
      }
    ],
    faqs: [
      {
        question: "Is 1-7-21 revision enough for JEE Main?",
        answer:
          "It is a good simple rhythm for a first system. Difficult chapters may need extra review based on mock errors and confidence."
      },
      {
        question: "Should revision include new questions?",
        answer:
          "Yes. Use a few mixed questions so the review tests recall, not only reading speed."
      }
    ],
    appActions: [
      { label: "Mark a chapter complete", href: "/syllabus#chapter-detail", description: "Open a chapter detail and mark it complete to create 1-day, 7-day, and 21-day revisions." },
      { label: "Review the action queue", href: "/dashboard#action-queue", description: "See upcoming and overdue revision actions with dates." },
      { label: "Repair a failed revision", href: "/error-book", description: "Turn a repeated miss into a logged mistake instead of ignoring it." }
    ],
    relatedSlugs: ["jee-main-daily-study-planner", "jee-main-error-book-method", "jee-main-formula-sheets"]
  },
  {
    slug: "jee-main-error-book-method",
    title: "How to Use an Error Book for JEE Main Mistake Repair",
    description:
      "A beginner-friendly error book method for classifying JEE mistakes, tracking repeats, and turning them into repair tasks.",
    updatedAt: "2026-06-06",
    keywords: ["JEE error book", "mistake notebook JEE", "JEE Main mistakes", "error log"],
    sections: [
      {
        heading: "Do not only save the wrong answer",
        body: [
          "A useful error book records the topic, weak chapter, mistake type, repeat count, and the repair task.",
          "The point is to prevent the same miss from returning in a mock test."
        ]
      },
      {
        heading: "Classify the mistake",
        body: [
          "Use simple labels: conceptual, calculation, silly mistake, time pressure, or memory gap.",
          "The label decides the repair. A concept mistake needs examples. A calculation mistake needs slow accuracy practice. A time-pressure mistake needs timed sets."
        ]
      },
      {
        heading: "Close mistakes only after repair",
        body: [
          "Mark a mistake resolved only when you have corrected the method and solved similar questions.",
          "Unresolved repeat mistakes should influence the next daily planner."
        ]
      }
    ],
    faqs: [
      {
        question: "How often should I review my JEE error book?",
        answer:
          "Review a small part daily and a larger set weekly. Repeated mistakes should appear in your planner until resolved."
      },
      {
        question: "Should silly mistakes be logged?",
        answer:
          "Yes. Silly mistakes become patterns when ignored. Track what triggered them and what guardrail will prevent them."
      }
    ],
    appActions: [
      { label: "Log a mistake", href: "/error-book", description: "Add subject, weak chapter, mistake type, repeat count, and repair task." },
      { label: "Resolve an action", href: "/dashboard#action-queue", description: "Mark a repair resolved only after the correction work is done." },
      { label: "Use repair in planner", href: "/planner", description: "Let unresolved mistakes influence today's plan." }
    ],
    relatedSlugs: ["jee-main-mock-test-analysis", "jee-main-revision-schedule", "drop-year-pcm-study-system"]
  },
  {
    slug: "jee-main-mock-test-analysis",
    title: "How to Analyze a JEE Main Mock Test Without Overthinking",
    description:
      "A clean mock analysis method: score, accuracy, weak chapter, repeated mistake, and next repair action.",
    updatedAt: "2026-06-06",
    keywords: ["JEE mock test analysis", "JEE Main mock score", "mock test mistakes"],
    sections: [
      {
        heading: "Separate score from diagnosis",
        body: [
          "The score tells you the result. Analysis tells you the next action. Do not stop at total marks.",
          "Look at each subject's marks, accuracy, and weak chapter before deciding tomorrow's plan."
        ]
      },
      {
        heading: "Find the real weak chapter",
        body: [
          "A low subject score is too broad. Write the exact weak chapter or concept that caused the drop.",
          "If you cannot name the weak chapter, review the paper again until the pattern is clear."
        ]
      },
      {
        heading: "Create repair tasks immediately",
        body: [
          "Each weak chapter should become a repair task: revise notes, solve targeted questions, and log every repeated miss.",
          "JEE Edgerunners turns low mock areas into error-book repairs so they can feed the planner."
        ]
      }
    ],
    faqs: [
      {
        question: "Should I give another mock immediately after a bad mock?",
        answer:
          "Usually no. First repair the biggest weak chapter and repeated mistakes, then take the next mock with a clear target."
      },
      {
        question: "Which matters more: marks or accuracy?",
        answer:
          "Both matter. Marks show output, accuracy shows how reliable the attempts were. Low accuracy needs repair even if marks look acceptable."
      }
    ],
    appActions: [
      { label: "Log mock scores", href: "/mocks", description: "Save marks, accuracy, and weak chapter for Physics, Chemistry, and Maths." },
      { label: "Add weak-chapter repairs", href: "/dashboard#action-queue", description: "Use the generated mock repair actions in the dashboard queue." },
      { label: "Study the weakest block", href: "/planner", description: "Let the next planner block focus on mock weakness." }
    ],
    relatedSlugs: ["jee-main-error-book-method", "jee-main-daily-study-planner", "drop-year-pcm-study-system"]
  },
  {
    slug: "jee-main-formula-sheets",
    title: "How to Build Useful JEE Main Formula Sheets",
    description:
      "Make formula sheets that support recall, chapter repair, and quick revision instead of becoming another unread notebook.",
    updatedAt: "2026-06-06",
    keywords: ["JEE formula sheet", "JEE Main formulas", "PCM formula revision"],
    sections: [
      {
        heading: "Keep formulas close to usage",
        body: [
          "A formula sheet is useful when it reminds you where and how a formula is used.",
          "Add one short trigger line beside important formulas: condition, common trap, or standard question type."
        ]
      },
      {
        heading: "Separate final formulas from repair notes",
        body: [
          "Do not mix every rough derivation into the final sheet. Keep the final formula sheet clean, and keep mistake-specific notes in the error book.",
          "This makes last-week revision faster and less stressful."
        ]
      },
      {
        heading: "Review formulas with active recall",
        body: [
          "Cover the formula and try to write it before looking. Then solve a short mixed set.",
          "Reading formulas silently feels easy, but recall shows whether the memory is ready for exam pressure."
        ]
      }
    ],
    faqs: [
      {
        question: "Should I download formula sheets or make my own?",
        answer:
          "A downloaded sheet can be a reference, but your own sheet is better for recall because it carries your mistakes and weak points."
      },
      {
        question: "How long should a formula sheet be?",
        answer:
          "Short enough to revise. If it becomes too long, split it by chapter or subject."
      }
    ],
    appActions: [
      { label: "Open chapter details", href: "/syllabus#chapter-detail", description: "Use formula, trap, repair, and guidance notes for a selected chapter." },
      { label: "Save recall notes", href: "/dashboard#scratchpad", description: "Pin formulas or traps in the scratchpad for quick review." },
      { label: "Create repair action", href: "/syllabus#chapter-detail", description: "Add a chapter repair when a formula trap repeats." }
    ],
    relatedSlugs: ["jee-main-revision-schedule", "jee-main-error-book-method", "drop-year-pcm-study-system"]
  },
  {
    slug: "drop-year-pcm-study-system",
    title: "A Drop-Year PCM Study System for JEE Main",
    description:
      "A practical study system for drop-year students: plan daily, finish chapters, revise on schedule, analyze mocks, and repair mistakes.",
    updatedAt: "2026-06-06",
    keywords: ["drop year JEE plan", "PCM dropper study system", "JEE Main drop year"],
    sections: [
      {
        heading: "Use one system, not ten separate trackers",
        body: [
          "A drop year becomes easier to manage when the planner, syllabus tracker, mock analysis, and error book talk to each other.",
          "The daily question is simple: what should I study, what should I revise, and what mistake needs repair?"
        ]
      },
      {
        heading: "Keep the dashboard honest",
        body: [
          "Do not fill a dashboard with fake productivity. Track completed sessions, real weak chapters, actual confidence, and unresolved mistakes.",
          "A small honest system beats a large tracker that you stop trusting."
        ]
      },
      {
        heading: "Build consistency before premium features",
        body: [
          "The free core should help students plan, practice, revise, and repair before any paid layer is considered.",
          "Trust comes from usefulness, not pressure or rank promises."
        ]
      }
    ],
    faqs: [
      {
        question: "What should a drop-year dashboard track first?",
        answer:
          "Start with daily hours, chapter completion, revision due dates, mock scores, weak chapters, and unresolved mistakes."
      },
      {
        question: "Can I use this system without logging in?",
        answer:
          "Yes. JEE Edgerunners keeps the dashboard usable in demo/local mode. Account sync is optional when Supabase is configured."
      }
    ],
    appActions: [
      { label: "Open dashboard", href: "/dashboard", description: "Start from the planner, action queue, mocks, and scratchpad in one place." },
      { label: "Track syllabus", href: "/syllabus", description: "Mark chapters complete and use confidence to keep the plan honest." },
      { label: "Analyze one mock", href: "/mocks", description: "Add a mock test and convert weak chapters into repair actions." }
    ],
    relatedSlugs: ["jee-main-daily-study-planner", "jee-main-mock-test-analysis", "jee-main-revision-schedule"]
  }
];

export function getResourceArticle(slug: string) {
  return resourceArticles.find((article) => article.slug === slug);
}

export function searchResourceArticles(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return resourceArticles;
  const terms = normalized.split(/\s+/).filter(Boolean);

  return resourceArticles.filter((article) => {
    const searchText = [
      article.title,
      article.description,
      article.keywords.join(" "),
      article.sections.map((section) => `${section.heading} ${section.body.join(" ")}`).join(" "),
      article.faqs.map((faq) => `${faq.question} ${faq.answer}`).join(" "),
      article.appActions.map((action) => `${action.label} ${action.description}`).join(" ")
    ].join(" ").toLowerCase();

    return terms.every((term) => searchText.includes(term));
  });
}

export function resourcePath(slug: string) {
  return `/resources/${slug}`;
}

export function resourceUrl(slug: string) {
  return absoluteUrl(resourcePath(slug));
}
