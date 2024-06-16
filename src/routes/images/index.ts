import { Hono } from "hono";
import type { HonoContext } from "../../types";
import { textImageRouter } from "./text";
import { emojiImageRouter } from "./emoji";
import { projectImageRouter } from "./project";
import { postImageRouter } from "./post";

export const imageRouter = new Hono<HonoContext>();

imageRouter.get(
  "*",
  async (c, next) => {
    if (c.env.ENVIRONMENT !== "production" && c.env.ENVIRONMENT !== "staging") {
      return await next();
    }
    const key = c.req.url;
    const cache = await caches.open("og-images");

    const response = await cache.match(key);
    if (!response) {
      // eslint-disable-next-line no-console
      console.info("serving image from network");
      await next();
      if (!c.res.ok) {
        console.error("failed to fetch image, skipping caching");
        return;
      }

      c.res.headers.set("Cache-Control", "public, max-age=3600");

      const response = c.res.clone();
      c.executionCtx.waitUntil(cache.put(key, response));
    } else {
      // eslint-disable-next-line no-console
      console.info("serving image from cache");
      return new Response(response.body, response);
    }
  },
);

imageRouter.route("/text", textImageRouter);
imageRouter.route("/emoji", emojiImageRouter);
imageRouter.route("/project", projectImageRouter);
imageRouter.route("/post", postImageRouter);
