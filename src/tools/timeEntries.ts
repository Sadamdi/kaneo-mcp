import { z } from "zod";
import { kaneo } from "../kaneoClient.js";
import type { ToolDef } from "../toolTypes.js";

export const timeEntryTools: ToolDef[] = [
  {
    name: "list_task_time_entries",
    description: "List time entries logged against a task.",
    schema: { taskId: z.string() },
    handler: async ({ taskId }: { taskId: string }) => kaneo.get(`/time-entry/task/${taskId}`),
  },
  {
    name: "get_time_entry",
    description: "Get a single time entry by ID.",
    schema: { id: z.string() },
    handler: async ({ id }: { id: string }) => kaneo.get(`/time-entry/${id}`),
  },
  {
    name: "create_time_entry",
    description: "Log a time entry against a task.",
    schema: {
      taskId: z.string(),
      startTime: z.string().describe("ISO 8601 datetime"),
      endTime: z.string().optional().describe("ISO 8601 datetime"),
      description: z.string().optional(),
    },
    handler: async (body: { taskId: string; startTime: string; endTime?: string; description?: string }) =>
      kaneo.post("/time-entry", body),
  },
  {
    name: "update_time_entry",
    description: "Update a time entry's start time, end time, or description.",
    schema: {
      id: z.string(),
      startTime: z.string(),
      endTime: z.string().optional(),
      description: z.string().optional(),
    },
    handler: async ({ id, ...body }: { id: string; startTime: string; endTime?: string; description?: string }) =>
      kaneo.put(`/time-entry/${id}`, body),
  },
];
