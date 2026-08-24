import type { WorkflowGroupView } from "../src/application/aibi-service";
import { AiDepthNavigator } from "./ai-depth-navigator";

export function WorkflowGroups({ groups }: { groups: WorkflowGroupView[] }) {
  const levels = groups.map((group) => ({
    id: group.id === "common-sense" ? "standard" : group.id === "deeper-integration" ? "integrated" : "advanced",
    title: group.title,
    description: group.description,
    items: group.tasks.map((task) => ({
      id: task.id,
      title: task.name,
      outcome: task.description,
      boundary: task.humanBoundary,
      signal: task.roleLabel,
    })),
  }));

  return <AiDepthNavigator levels={levels} />;
}
