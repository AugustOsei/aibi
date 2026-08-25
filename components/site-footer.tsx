import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <p className="footer-mark">AIBI</p>
          <p className="footer-copy">See what today’s AI can do across industries, what businesses report using, and where a gap may remain.</p>
        </div>
        <div className="footer-links">
          <Link href="/about">About</Link>
          <Link href="/industries">Industries</Link>
          <Link href="/countries">Countries</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/updates">Updates</Link>
        </div>
        <div className="footer-note">
          <p>Missing evidence is shown as unavailable—not as zero.</p>
          <a href="https://www.theaugustdispatch.com" target="_blank" rel="noreferrer">Founded by the publisher of The August Dispatch ↗</a>
        </div>
      </div>
    </footer>
  );
}
