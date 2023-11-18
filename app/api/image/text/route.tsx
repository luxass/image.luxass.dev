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
    bgColor,
    height,
    text,
    textColor,
    width,
  } = props;
  const [inter900, inter700, inter400] = await Promise.all([
    font("Inter", 900),
    font("Inter", 700),
    font("Inter", 400),
  ]);

  return new ImageResponse(
    (
      <div
        tw={`bg-${bgColor} flex h-screen w-screen items-center justify-center p-5 text-center`}
      >
        <p tw={`text-[${props.fontSize}rem] text-${textColor}`}>{text}</p>
      </div>
    ),
    {
      width,
      height,
      fonts: [
        { name: "Inter", data: inter900, weight: 900 },
        { name: "Inter", data: inter700, weight: 700 },
        { name: "Inter", data: inter400, weight: 400 },
      ],
    },
  );
}
