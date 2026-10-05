// How an industry reads as the subject of a sentence, where the name alone is awkward.
const SUBJECTS: Record<string, string> = {
  agriculture: "farms",
  "tourism-hospitality": "hotels, guesthouses and tour operators",
};

export const industrySubject = (slug: string, name: string) => SUBJECTS[slug] ?? name.toLowerCase();
export const countryInSentence = (name: string) => (["United Kingdom", "United States"].includes(name) ? `the ${name}` : name);

const parseDay = (iso: string) => new Date(`${iso}T00:00:00Z`);
const dayText = (date: Date, options: Intl.DateTimeFormatOptions) => date.toLocaleDateString("en-GB", { timeZone: "UTC", ...options });
// Turns "2026-07-13 to 2026-07-26" into "13–26 July 2026"; anything else is returned unchanged.
export const formatPeriod = (period: string) => {
  const match = /^(\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2})$/.exec(period);
  if (!match) return period;
  const [from, to] = [parseDay(match[1]!), parseDay(match[2]!)];
  const full = dayText(to, { day: "numeric", month: "long", year: "numeric" });
  if (from.getUTCFullYear() !== to.getUTCFullYear()) return `${dayText(from, { day: "numeric", month: "long", year: "numeric" })} to ${full}`;
  if (from.getUTCMonth() !== to.getUTCMonth()) return `${dayText(from, { day: "numeric", month: "long" })} to ${full}`;
  return `${from.getUTCDate()}–${full}`;
};
export const industryQuestion = (slug: string, name: string, countryName?: string) =>
  `What can ${industrySubject(slug, name)}${countryName ? ` in ${countryInSentence(countryName)}` : ""} use AI for today?`;
