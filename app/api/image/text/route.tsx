import { ImageResponse } from "next/og";
import { TEXT_PARAMS } from "./params";
import { font } from "~/lib/font";

export const runtime = "edge";

export async function GET(req: Request) {
  const parsed = TEXT_PARAMS.decodeRequest(req);
  if (!parsed.success) {
    return new Response(parsed.error.toString(), { status: 400 });
  }

  const props = parsed.data.input;
  const {
    bgColor: _bgColor,
    height,
    text,
    textColor: _textColor,
    width,
  } = props;
  const inter400 = await font("Inter", 400);

  const bgColor = `bg-${_bgColor}`;
  const textColor = `text-${_textColor}`;

  return new ImageResponse(
    (
      <div
        tw={`${bgColor} flex h-screen w-screen items-center justify-center p-5 text-center`}
        style={{ fontFamily: "Inter" }}
      >
        <p tw={`text-[12rem] ${textColor}`}>{text}</p>
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
