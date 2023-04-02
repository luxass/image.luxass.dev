/* eslint-disable react/no-unknown-property */
import { ImageResponse } from "@vercel/og";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  let width = Number(searchParams.get("width") || "300");
  let height = Number(searchParams.get("height") || "300");
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
