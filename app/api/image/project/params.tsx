import { z } from "zod";
import { params, truncateWords } from "~/lib/utils";

export const PROJECT_PARAMS = params(
  z.object({
    repo: z
      .custom<`${string}/${string}`>((str) => typeof str === "string" && str.split("/").length === 2),
    description: z.string().transform((str) => truncateWords(str, 145)).default("No description"),
  }),
);
