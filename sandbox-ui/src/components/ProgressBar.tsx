interface Props {
  value: number; // 0..100
}

export default function ProgressBar({ value }: Props) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}