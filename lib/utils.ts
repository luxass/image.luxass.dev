import { z } from "zod";

type Primitives = string | number | boolean | null;
type JsonValue = Primitives | JsonValue[] | { [key: string]: JsonValue };

const jsonStr = z.string().transform((str, ctx) => {
  try {
    return JSON.parse(str) as JsonValue;
  } catch (error) {
    ctx.addIssue({ code: "custom", message: "Needs to be JSON" });
  }
});

export function params<TType>(schema: z.ZodType<TType>) {
  const querySchema = z.object({
    input: jsonStr.pipe(schema),
  });
  return {
    decodeRequest: (req: Request) => {
      const url = new URL(req.url);
      const obj = Object.fromEntries(url.searchParams.entries());

      return querySchema.safeParse(obj);
    },
    toSearchString: (obj: (typeof schema)["_input"]) => {
      schema.parse(obj);
      return `input=${encodeURIComponent(JSON.stringify(obj))}`;
    },
    schema,
  };
}

export function truncateWords(str: string, maxCharacters: number) {
  if (str.length <= maxCharacters) {
    return str;
  }
  // break at closest word
  const truncated = str.slice(0, maxCharacters);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace)}…`;
}
