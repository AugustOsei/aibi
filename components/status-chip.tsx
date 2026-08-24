import type { DataStatus } from "../src/application/aibi-service";

const labels: Record<DataStatus, string> = {
  available: "Available",
  partial: "Partial",
  insufficient_evidence: "Insufficient evidence",
  in_development: "In development",
};

export function StatusChip({ status, label }: { status: DataStatus; label?: string }) {
  return <span className={`status-chip status-chip--${status}`}>{label ?? labels[status]}</span>;
}
