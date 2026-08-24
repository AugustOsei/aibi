import type { Metadata } from "next";
import { createPageMetadata } from "../../src/config/site";

export const metadata: Metadata = createPageMetadata({
  title: "Updates",
  description: "Follow changes to AIBI country coverage, industry analysis, AI capability assessments, and adoption evidence.",
  path: "/updates",
});

const updateTypes = [
  "New industry analysis",
  "New country coverage",
  "Material AI capability changes",
  "New or revised adoption evidence",
  "Updated AIBI scores or classifications",
] as const;

export default function UpdatesPage() {
  return (
    <div className="shell page-shell updates-page">
      <header className="page-intro">
        <p className="eyebrow">AIBI updates</p>
        <h1>Follow how the index changes.</h1>
        <p>AIBI is periodically reevaluated rather than treated as a permanent snapshot. Update notes will record meaningful changes to coverage, evidence, methods, and classifications.</p>
      </header>

      <section className="updates-register" aria-labelledby="updates-register-heading">
        <div>
          <p className="eyebrow">What will be tracked</p>
          <h2 id="updates-register-heading">Changes worth noting</h2>
        </div>
        <ol>
          {updateTypes.map((update, index) => (
            <li key={update}><span>{String(index + 1).padStart(2, "0")}</span>{update}</li>
          ))}
        </ol>
      </section>

      <section className="updates-placeholder" aria-labelledby="updates-placeholder-heading">
        <p className="eyebrow">Email updates</p>
        <h2 id="updates-placeholder-heading">A simple update list is planned.</h2>
        <p>There is no subscription system connected yet. Until it is available, this page will remain the home for AIBI update notes.</p>
        <span aria-disabled="true">Email updates coming later</span>
      </section>
    </div>
  );
}
