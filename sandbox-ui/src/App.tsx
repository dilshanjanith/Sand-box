import SandboxCard from "./components/SandboxCard";
import { useSandboxSimulation } from "./hooks/useSandboxSimulation";
import "./styles.css";

export default function App() {
  const { snapshot, rerun } = useSandboxSimulation();

  return (
    <main className="page">
      <SandboxCard data={snapshot} onRerun={rerun} />
    </main>
  );
}