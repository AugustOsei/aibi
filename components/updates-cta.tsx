import Link from "next/link";

export function UpdatesCta() {
  return (
    <aside className="updates-cta" aria-labelledby="updates-cta-heading">
      <div>
        <p className="eyebrow">Living index</p>
        <h2 id="updates-cta-heading">Follow AIBI updates</h2>
      </div>
      <p>See when industries or countries are added, capabilities materially change, adoption evidence moves, or an AIBI classification is reevaluated.</p>
      <Link href="/updates">Update notes →</Link>
    </aside>
  );
}
