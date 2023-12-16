import { ImageResponse } from "next/og";
import { RANDOM_EMOJI_PARAMS } from "./params";

export const runtime = "edge";

export async function GET(req: Request) {
  const parsed = RANDOM_EMOJI_PARAMS.decodeRequest(req);
  if (!parsed.success) {
    return new Response(parsed.error.toString(), { status: 400 });
  }

  const EMOJIS = [
    "😊",
    "🚀",
    "⭐",
    "🔧",
    "🎉",
    "🔍",
    "📚",
    "🔥",
    "👨‍💻",
    "🔄",
    "🚦",
    "🤔",
    "💡",
    "👍",
    "🌍",
    "💡",
    "🤖",
  ];

  const text = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

  const props = parsed.data.input;
  const {
    bgColor,
    height,
    width,
  } = props;

  const bg = `bg-${bgColor}`;

  return new ImageResponse(
    (
      <div
        tw={`${bg} flex h-screen w-screen items-center justify-center p-5 text-center`}
      >
        <p
          tw="text-[12rem]"
        >
          {text}
        </p>
      </div>
    ),
    {
      width,
      height,
    },
  );
}
