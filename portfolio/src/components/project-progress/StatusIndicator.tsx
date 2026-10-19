import type { TaskStatus } from "@/types/project-progress";

const presentation = {
  planned: { label: "Planejado", symbol: "○" },
  "in-progress": { label: "Em andamento", symbol: "◐" },
  completed: { label: "Concluído", symbol: "✓" },
  blocked: { label: "Bloqueado", symbol: "!" },
} satisfies Record<TaskStatus, { label: string; symbol: string }>;

export default function StatusIndicator({ status }: { status: TaskStatus }) {
  return (
    <span className={`task-status task-status--${status}`}>
      <span aria-hidden="true">{presentation[status].symbol}</span>
      {presentation[status].label}
    </span>
  );
}
