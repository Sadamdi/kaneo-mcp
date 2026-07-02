import { z } from "zod";
import { kaneo } from "../kaneoClient.js";
import type { ToolDef } from "../toolTypes.js";

export const assetTools: ToolDef[] = [
  {
    name: "get_asset",
    description: "Retrieve an uploaded asset (attachment) by ID.",
    schema: { id: z.string() },
    handler: async ({ id }: { id: string }) => kaneo.get(`/asset/${id}`),
  },
];
