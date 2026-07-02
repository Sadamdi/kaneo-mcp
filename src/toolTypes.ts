import { z } from "zod";

export interface ToolDef {
  name: string;
  description: string;
  schema: z.ZodRawShape;
  handler: (args: any) => Promise<unknown>;
}
