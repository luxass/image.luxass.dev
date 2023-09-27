import { z } from "zod";
import { params } from "~/lib/utils";

export const FONT_PARAMS = params(
  z.object({
    family: z.string(),
    weight: z.number().default(400),
    text: z.string().optional(),
  }),
);
