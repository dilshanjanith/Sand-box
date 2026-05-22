export type SandboxStatus = "running" | "done";

export type StepState = "done" | "active" | "pending";

export interface SandboxStep {
  id: string;
  label: string;
  durationMs: number;
  state: StepState;
  cached?: boolean;
}

export interface SandboxSnapshot {
  status: SandboxStatus;
  runtimeLabel: string;
  topStatusLabel: string; // Warm · Running | Done
  progress: number; // 0..100
  steps: SandboxStep[];
  elapsedLabel: string; // 2.88s
  footerRightLabel?: string; // Executing...
  exitLabel?: string; // Exited 0 · 2300ms
  showRerun: boolean;
  warmRun: boolean;
}
