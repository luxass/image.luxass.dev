import { Hono } from "hono";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import type { HonoContext } from "./types";
import indexPage from "./assets/index.html";
import { imageRouter } from "./routes/images";

const app = new Hono<HonoContext>();
app.use("*", logger());

app.route("/api/image", imageRouter);

app.get("/", async (c) => {
  const index = indexPage
    .replaceAll("{{ ENVIRONMENT }}", c.env.ENVIRONMENT)
    .replaceAll("{{ STRINGIFIED_ENVIRONMENT }}", c.env.ENVIRONMENT === "staging" ? "staging." : "")
    .replaceAll("{{ URL }}", `https://${c.env.ENVIRONMENT === "staging" ? "staging." : ""}image.luxass.dev`)
    .replaceAll("{{ OG_URL }}", `https://image.luxass.dev/api/image/random-emoji`);
  return c.html(index);
});

app.get("/favicon.ico", async (c) => {
  // return a random emoji as favicon
  return c.redirect("/api/image/random-emoji");
});

app.get("/view-source", (c) => {
  return c.redirect("https://github.com/luxass/image.luxass.dev");
});

app.get("/ping", (c) => {
  c.status(418);
  return c.text("pong!");
});

app.onError(async (err, c) => {
  console.error(err);
  const url = new URL(c.req.url);
  if (err instanceof HTTPException) {
    return c.json({
      path: url.pathname,
      status: err.status,
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  return c.json({
    path: url.pathname,
    status: 500,
    message: "Internal server error",
    timestamp: new Date().toISOString(),
  });
});

app.notFound(async (c) => {
  const url = new URL(c.req.url);
  return c.json({
    path: url.pathname,
    status: 404,
    message: "Not found",
    timestamp: new Date().toISOString(),
  });
});

export default app;
