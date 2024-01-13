import type { z } from "zod";
import {
  FONT_PARAMS,
} from "../app/api/font/params";
import { POST_PARAMS } from "../app/api/image/post/params";
import { PROJECT_PARAMS } from "../app/api/image/project/params";
import { RANDOM_EMOJI_PARAMS } from "../app/api/image/random-emoji/params";
import { TEXT_PARAMS } from "../app/api/image/text/params";

type StaticRoutes = Exclude<__next_route_internal_types__.StaticRoutes, "/">;
type NormalizeRoute<T extends string> = T extends `/api/${infer Rest}` ? Rest : T;

const routes = {
  "font": FONT_PARAMS,
  "image/post": POST_PARAMS,
  "image/project": PROJECT_PARAMS,
  "image/random-emoji": RANDOM_EMOJI_PARAMS,
  "image/text": TEXT_PARAMS,
} as const;

export function print<T extends NormalizeRoute<StaticRoutes>>(url: T, options: z.infer<typeof routes[T]["schema"]>) {
  console.log(`http://localhost:3000/api/${url}?input=${encodeURIComponent(JSON.stringify(options))}`);
}

print("image/post", {
  date: "2021-01-01",
  description: "This is a description",
  title: "This is a title",
});

print("image/random-emoji", {
});
