export const siteUrl = "https://jee-edgerunners.vercel.app";

export const siteName = "JEE Edgerunners";

export const siteDescription =
  "A free JEE Main PCM study system for daily planning, syllabus tracking, revision, mock analysis, and mistake repair.";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function routeTitle(title: string) {
  return title;
}
