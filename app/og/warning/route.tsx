import { ImageResponse } from "@vercel/og";
import { clamp } from "lib/utils";

export function GET(req: Request) {
  if (!req.url) return new Response("say whaaat", { status: 500 });
  const { searchParams } = new URL(req.url);
  let width = Number(searchParams.get("width") || searchParams.get("w") || "300");
  let height = Number(searchParams.get("height") || searchParams.get("h") || "300");
  if (isNaN(width) || isNaN(height)) {
    return new Response("Invalid width or height", { status: 400 });
  }

  width = clamp(width, 300, 600);
  height = clamp(height, 300, 600);

  return new ImageResponse(
    (
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
        <path fill="none" stroke="#FAB005" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4m0 4h.01" />
      </svg>
    ),
    {
      width,
      height
    }
  );
}

