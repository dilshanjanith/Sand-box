import { useEffect, useMemo, useRef, useState } from "react";
import type {
  SandboxSnapshot,
  SandboxStep,
  SandboxStatus,
} from "../types/sandbox";

type TerminalLine = {
  id: string;
  text: string;
  kind?: "muted" | "ok" | "normal";
};

const BASE_STEPS: Omit<SandboxStep, "state">[] = [
  { id: "allocate", label: "Allocate microVM", durationMs: 180 },
  { id: "restore", label: "Restore snapshot", durationMs: 820, cached: true },
  { id: "mount", label: "Mount ephemeral FS", durationMs: 620 },
  {
    id: "boot",
    label: "Boot runtime · Node 26",
    durationMs: 1100,
    cached: true,
  },
  { id: "exec", label: "Execute main.js", durationMs: 3300 },
  { id: "reclaim", label: "Reclaim sandbox", durationMs: 900 },
];

const TOTAL_MS = BASE_STEPS.reduce((a, b) => a + b.durationMs, 0);
const TICK_MS = 50;

function elapsedToStepState(elapsed: number): SandboxStep[] {
  let acc = 0;
  let activeIndex = -1;

  for (let i = 0; i < BASE_STEPS.length; i++) {
    const start = acc;
    const end = acc + BASE_STEPS[i].durationMs;
    if (elapsed >= start && elapsed < end) {
      activeIndex = i;
      break;
    }
    acc = end;
  }

  return BASE_STEPS.map((s, i) => {
    const start = BASE_STEPS.slice(0, i).reduce((x, y) => x + y.durationMs, 0);
    const end = start + s.durationMs;

    if (elapsed >= end) return { ...s, state: "done" as const };
    if (i === activeIndex) return { ...s, state: "active" as const };
    return { ...s, state: "pending" as const };
  });
}

function buildTerminal(elapsed: number): TerminalLine[] {
  const lines: TerminalLine[] = [
    { id: "cmd", text: "$ node main.js", kind: "muted" },
  ];

  if (elapsed > 3500)
    lines.push({ id: "f1", text: "fetching dataset … 0.3 MB" });
  if (elapsed > 4300)
    lines.push({ id: "f2", text: "fetching dataset … 1.2 MB" });
  if (elapsed > 5000) lines.push({ id: "c1", text: "computed 1,284 rows" });
  if (elapsed >= TOTAL_MS)
    lines.push({ id: "ok", text: "✓ done in 312ms", kind: "ok" });

  return lines;
}

export function useSandboxSimulation() {
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState<SandboxStatus>("running");
  const timerRef = useRef<number | null>(null);

  const rerun = () => {
    setElapsed(0);
    setStatus("running");
  };

  useEffect(() => {
    if (status !== "running") return;

    timerRef.current = window.setInterval(() => {
      setElapsed((prev) => {
        const next = prev + TICK_MS;
        if (next >= TOTAL_MS) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          setStatus("done");
          return TOTAL_MS;
        }
        return next;
      });
    }, TICK_MS);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [status]);

  const steps = useMemo(
    () =>
      status === "done"
        ? BASE_STEPS.map((s) => ({ ...s, state: "done" as const }))
        : elapsedToStepState(elapsed),
    [elapsed, status],
  );

  const progress = Math.round((elapsed / TOTAL_MS) * 100);
  const terminalLines = buildTerminal(elapsed);

  const snapshot: SandboxSnapshot & { terminalLines: TerminalLine[] } = {
    status,
    runtimeLabel: "node26",
    topStatusLabel: status === "running" ? "Warm · Running" : "Done",
    progress: status === "done" ? 100 : progress,
    steps,
    elapsedLabel: `${(elapsed / 1000).toFixed(2)}s`,
    footerRightLabel: status === "running" ? "Executing..." : undefined,
    exitLabel: status === "done" ? "Exited 0 · 2300ms" : undefined,
    showRerun: status === "done",
    warmRun: true,
    terminalLines,
  };

  return { snapshot, rerun };
}
