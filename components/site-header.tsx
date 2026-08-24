import Link from "next/link";

const navigation = [
  ["About", "/about"],
  ["Industries", "/industries"],
  ["Countries", "/countries"],
  ["Methodology", "/methodology"],
  ["Updates", "/updates"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__top shell">
        <Link href="/" className="wordmark" aria-label="Artificial Intelligence Business Index home">
          <span className="wordmark__mark">AIBI</span>
          <span className="wordmark__name">Artificial Intelligence Business Index</span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <div className="site-nav__inner">
            {navigation.map(([label, href]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
