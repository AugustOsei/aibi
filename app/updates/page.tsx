import type { Metadata } from "next";

import { createPageMetadata } from "../../src/config/site";
import { AI_CAPABILITY_HORIZON } from "../../src/data/ai-capability-horizon";
import "../../components/home.css";
import "../../components/pages.css";

export const metadata: Metadata = createPageMetadata({
  title: "Updates",
  description: "When AIBI was last reviewed and what kinds of changes are recorded: new countries, new industries, AI capability changes and new evidence.",
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
  const reviewed = new Date(`${AI_CAPABILITY_HORIZON.lastReviewed}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  return (
    <div className="home-flat pg">
      <header className="pg-head shell">
        <p className="home-label">Updates</p>
        <h1>How the index changes.</h1>
        <p>AI capabilities, costs and adoption do not stand still, so AIBI is reviewed periodically. Meaningful changes are recorded here.</p>
      </header>

      <section className="pg-split shell" aria-labelledby="updates-latest-heading">
        <div>
          <p className="home-label">Latest review</p>
          <h2 id="updates-latest-heading">{reviewed}</h2>
        </div>
        <div>
          <p>The list of AI models and products the index is reviewed against was last checked on this date.</p>
        </div>
      </section>

      <section className="pg-split shell" aria-labelledby="updates-register-heading">
        <div>
          <p className="home-label">What is tracked</p>
          <h2 id="updates-register-heading">Changes worth noting</h2>
        </div>
        <ul className="pg-list">
          {updateTypes.map((update) => <li key={update}><strong>{update}</strong></li>)}
        </ul>
      </section>

      <section className="pg-split shell" aria-labelledby="updates-email-heading">
        <div>
          <p className="home-label">Email updates</p>
          <h2 id="updates-email-heading">Not available yet.</h2>
        </div>
        <div>
          <p>There is no subscription list yet. Until there is, this page is the home for AIBI update notes.</p>
        </div>
      </section>
    </div>
  );
}
