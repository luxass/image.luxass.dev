import { z } from "zod";
import { params } from "~/lib/utils";

export const RANDOM_EMOJI_PARAMS = params(
  z.object({
    width: z.number().min(300).max(1200).default(300),
    height: z.number().min(300).max(600).default(300),
    fontSize: z.number().min(1).max(12).default(12),
    bgColor: z.string().default("white"),
  }),
);
