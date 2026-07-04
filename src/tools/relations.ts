import { z } from "zod";
import { kaneo } from "../kaneoClient.js";
import type { ToolDef } from "../toolTypes.js";

export const relationTools: ToolDef[] = [
  {
    name: "list_task_relations",
    description: "List a task's relations (dependencies/links to other tasks).",
    schema: { taskId: z.string() },
    handler: async ({ taskId }: { taskId: string }) => kaneo.get(`/task-relation/${taskId}`),
  },
  {
    name: "create_task_relation",
    description: "Link two tasks with a relation. relationType must be 'blocks', 'related', or 'subtask'.",
    schema: {
      sourceTaskId: z.string(),
      targetTaskId: z.string(),
      relationType: z.enum(["blocks", "related", "subtask"]),
    },
    handler: async (body: { sourceTaskId: string; targetTaskId: string; relationType: string }) =>
      kaneo.post("/task-relation", body),
  },
  {
    name: "delete_task_relation",
    description: "Remove a task relation by its id. Destructive — confirm first.",
    schema: { id: z.string() },
    handler: async ({ id }: { id: string }) => kaneo.delete(`/task-relation/${id}`),
  },
  {
    name: "list_workflow_rules",
    description: "List a project's workflow automation rules (which integration event moves a task to which column).",
    schema: { projectId: z.string() },
    handler: async ({ projectId }: { projectId: string }) => kaneo.get(`/workflow-rule/${projectId}`),
  },
  {
    name: "upsert_workflow_rule",
    description: "Create or update a project's workflow rule: when an integration event fires, move matching tasks to a column.",
    schema: {
      projectId: z.string(),
      integrationType: z.string().describe("e.g. 'github', 'gitea'"),
      eventType: z.string().describe("integration event that triggers the rule"),
      columnId: z.string().describe("destination column id from list_columns"),
    },
    handler: async ({ projectId, ...body }: { projectId: string; integrationType: string; eventType: string; columnId: string }) =>
      kaneo.put(`/workflow-rule/${projectId}`, body),
  },
  {
    name: "delete_workflow_rule",
    description: "Delete a workflow rule by its id. Destructive — confirm first.",
    schema: { id: z.string() },
    handler: async ({ id }: { id: string }) => kaneo.delete(`/workflow-rule/${id}`),
  },
];
