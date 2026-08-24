import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell not-found">
      <p className="eyebrow">404 · Not found</p>
      <h1>This index page is not available.</h1>
      <p>The requested country or industry may not be part of the current research scope.</p>
      <Link className="text-link" href="/">Return to overview →</Link>
    </div>
  );
}
