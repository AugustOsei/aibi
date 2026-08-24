import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <p className="footer-mark">AIBI</p>
          <p className="footer-copy">What AI can do. What industries report. The gap between them.</p>
        </div>
        <div className="footer-links">
          <Link href="/industries">Industries</Link>
          <Link href="/countries">Countries</Link>
          <Link href="/methodology">Methodology</Link>
        </div>
        <p className="footer-note">Missing evidence is shown as unavailable—not as zero.</p>
      </div>
    </footer>
  );
}
