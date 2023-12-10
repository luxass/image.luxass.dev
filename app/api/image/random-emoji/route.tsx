import { ImageResponse } from "next/og";
import { RANDOM_EMOJI_PARAMS } from "./params";
import { font } from "~/lib/font";

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
    "💻",
    "🌐",
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
    "📱",
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
  const [inter400] = await Promise.all([
    font("Inter", 400),
  ]);

  return new ImageResponse(
    (
      <div
        tw={`bg-${bgColor} flex h-screen w-screen items-center justify-center p-5 text-center`}
      >
        <p tw={`text-[${props.fontSize}rem]`}>{text}</p>
      </div>
    ),
    {
      width,
      height,
      fonts: [
        { name: "Inter", data: inter400, weight: 400 },
      ],
    },
  );
}
