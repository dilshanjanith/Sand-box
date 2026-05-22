import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";
import StepItem from "./StepItem";
import Terminal from "./Terminal";
import type { SandboxSnapshot } from "../types/sandbox";

type TerminalLine = { id: string; text: string; kind?: "muted" | "ok" | "normal" };

interface Props {
  data: SandboxSnapshot & { terminalLines: TerminalLine[] };
  onRerun: () => void;
}

export default function SandboxCard({ data, onRerun }: Props) {
  return (
    <article className="sandbox-card">
      <header className="sandbox-header">
        <div className="title-wrap">
          <h1>Sandbox</h1>
          <span className="runtime-pill">{data.runtimeLabel}</span>
        </div>
        <StatusBadge status={data.status} label={data.topStatusLabel} />
      </header>

      <ProgressBar value={data.progress} />

      <section className="steps-panel">
        {data.steps.map((step) => (
          <StepItem key={step.id} step={step} />
        ))}
        <Terminal lines={data.terminalLines} />
      </section>

      <footer className="sandbox-footer">
        <div className="footer-left">{data.exitLabel ?? data.elapsedLabel}</div>
        <div className="footer-right">
          {data.showRerun ? (
            <button className="rerun-btn" onClick={onRerun}>
              ↻ Re-run (warm)
            </button>
          ) : (
            data.footerRightLabel
          )}
        </div>
      </footer>
    </article>
  );
}