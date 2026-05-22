type TerminalLine = { id: string; text: string; kind?: "muted" | "ok" | "normal" };

interface Props {
  lines: TerminalLine[];
}

export default function Terminal({ lines }: Props) {
  return (
    <div className="terminal">
      {lines.map((line) => (
        <p key={line.id} className={line.kind === "ok" ? "ok" : line.kind === "muted" ? "cmd" : ""}>
          {line.text}
        </p>
      ))}
    </div>
  );
}