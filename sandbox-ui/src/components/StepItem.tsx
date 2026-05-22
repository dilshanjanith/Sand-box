import type { SandboxStep } from "../types/sandbox";

interface Props {
  step: SandboxStep;
}

function StepIcon({ state }: { state: SandboxStep["state"] }) {
  if (state === "done") {
    return <span className="step-icon done">✓</span>;
  }
  if (state === "active") {
    return <span className="step-icon active" />;
  }
  return <span className="step-icon pending" />;
}

export default function StepItem({ step }: Props) {
  return (
    <div className={`step-item ${step.state}`}>
      <div className="step-left">
        <StepIcon state={step.state} />
        <span className="step-label">{step.label}</span>
      </div>

      <div className="step-right">
        {step.cached && <span className="cached-pill">cached</span>}
        <span className="step-ms">{step.state === "active" ? "..." : `${step.durationMs}ms`}</span>
      </div>
    </div>
  );
}