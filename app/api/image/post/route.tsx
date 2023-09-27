import { ImageResponse } from "next/server";
import { POST_PARAMS } from "./params";
import { font } from "~/lib/font";

export const runtime = "edge";

export async function GET(req: Request) {
  const [inter900, inter700, inter400] = await Promise.all([
    font("Inter", 900),
    font("Inter", 700),
    font("Inter", 400),
  ]);

  const parsed = POST_PARAMS.decodeRequest(req);
  if (!parsed.success) {
    return new Response(parsed.error.toString(), { status: 400 });
  }

  const props = parsed.data.input;
  return new ImageResponse(
    (
      <div tw="bg-neutral-900 h-full w-full text-white bg-cover flex flex-col p-14">
        <div tw="flex flex-col justify-between w-full h-full">
          <div tw="flex flex-col w-full">
            <div tw="flex justify-between items-center w-full">
              <div tw="flex flex-col flex-1 pr-6">
                <p tw="text-blue-500 text-2xl font-semibold">{props.date}</p>
                <h1 tw="text-6xl font-extrabold leading-tight py-0 my-0">
                  {props.title}
                </h1>
              </div>
            </div>
            <p tw="text-3xl leading-snug text-neutral-300">{props.description}</p>
          </div>
          <div tw="flex items-center">
            <img
              src="https://assets.luxass.dev/logos/dino.png"
              alt="author profile"
              width="75px"
              height="75px"
              tw="mr-6 rounded-xl"
            />
            <div tw="flex flex-col justify-center">
              <p tw="text-2xl leading-[1px] font-semibold">
                luxass.dev
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      fonts: [
        { name: "Inter", data: inter900, weight: 900 },
        { name: "Inter", data: inter700, weight: 700 },
        { name: "Inter", data: inter400, weight: 400 },
      ],
    },
  );
}
