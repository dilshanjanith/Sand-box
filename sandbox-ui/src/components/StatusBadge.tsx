import type { SandboxStatus } from "../types/sandbox";

interface Props {
  status: SandboxStatus;
  label: string;
}

export default function StatusBadge({ status, label }: Props) {
  return (
    <div className={`status-badge ${status}`}>
      <span>{label}</span>
      <span className="dot" />
    </div>
  );
}