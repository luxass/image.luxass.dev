import { ImageResponse } from "@vercel/og";
import { clamp } from "lib/utils";

// TODO: Remove this when all sites are merged to the new API
export function GET(req: Request) {
  if (!req.url) return new Response("say whaaat", { status: 500 });
  const { searchParams } = new URL(req.url);
  let width = Number(searchParams.get("width") || searchParams.get("w") || "300");
  let height = Number(searchParams.get("height") || searchParams.get("h") || "300");
  const text = searchParams.get("text") || "LN";
  const textColor = searchParams.get("textColor") || "blue-600";
  const bgColor = searchParams.get("bgColor") || "white";
  let fontSize = Number(searchParams.get("fontSize") || "8");

  if (isNaN(fontSize)) {
    fontSize = 8;
  }

  if (isNaN(width) || isNaN(height)) {
    return new Response("Invalid width or height", { status: 400 });
  }

  width = clamp(width, 300, 1200);
  height = clamp(height, 300, 630);
  fontSize = clamp(fontSize, 8, 16);

  return new ImageResponse(
    (
      <div
        tw={`text-center items-center justify-center flex w-full h-full bg-${bgColor} text-[${fontSize}rem]`}>
        <p tw={`text-${textColor}`}>{text}</p>
      </div>
    ),
    {
      width,
      height
    }
  );
}

