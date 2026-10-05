// How an industry reads as the subject of a sentence, where the name alone is awkward.
const SUBJECTS: Record<string, string> = {
  agriculture: "farms",
  "tourism-hospitality": "hotels, guesthouses and tour operators",
};

export const industrySubject = (slug: string, name: string) => SUBJECTS[slug] ?? name.toLowerCase();
export const countryInSentence = (name: string) => (["United Kingdom", "United States"].includes(name) ? `the ${name}` : name);
export const industryQuestion = (slug: string, name: string, countryName?: string) =>
  `What can ${industrySubject(slug, name)}${countryName ? ` in ${countryInSentence(countryName)}` : ""} use AI for today?`;
