import type { ReactNode } from "react";

export function ResearchDrawer({ children, label = "Open evidence and methodology" }: { children: ReactNode; label?: string }) {
  return (
    <details className="research-drawer">
      <summary>
        <span>
          <small>Optional</small>
          <strong>{label}</strong>
        </span>
        <b aria-hidden="true">+</b>
      </summary>
      <div className="research-drawer__body">{children}</div>
    </details>
  );
}
