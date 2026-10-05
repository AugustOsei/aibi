import Link from "next/link";

import "../components/home.css";
import "../components/pages.css";

export default function NotFound() {
  return (
    <div className="home-flat pg pg-404">
      <header className="pg-head shell">
        <p className="home-label">404 · Not found</p>
        <h1>This page is not in the index.</h1>
        <p>The country or industry you asked for may not be covered yet. <Link href="/">Back to the start →</Link></p>
      </header>
    </div>
  );
}
