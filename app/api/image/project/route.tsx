import process from "process";
import { ImageResponse } from "next/og";
import { PROJECT_PARAMS } from "./params";
import { font } from "~/lib/font";

export const runtime = "edge";

async function getStars(repo: `${string}/${string}`) {
  const data = await (
    await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    })
  ).json();
  if (typeof data?.stargazers_count !== "number") {
    throw new TypeError("Could not fetch stars");
  }
  return new Intl.NumberFormat().format(data.stargazers_count);
}

export async function GET(req: Request) {
  const parsed = PROJECT_PARAMS.decodeRequest(req);
  if (!parsed.success) {
    return new Response(parsed.error.toString(), { status: 400 });
  }

  const props = parsed.data.input;

  const [inter900, inter700, inter400, stars] = await Promise.all([
    font("Inter", 900),
    font("Inter", 700),
    font("Inter", 400),
    getStars(props.repo),
  ]);

  return new ImageResponse(
    <div
      tw="flex h-full w-full flex-col bg-neutral-900 bg-cover p-14 text-white"
      style={{ fontFamily: "Inter" }}
    >
      <div tw="flex h-full w-full flex-col items-center justify-center gap-y-6">
        <div tw="flex items-center">
          <img
            src="https://assets.luxass.dev/logos/dino.svg"
            width="128px"
            height="128px"
            alt="luxass logo"
          />
          <h1 tw="ml-8 text-6xl font-extrabold">{props.repo}</h1>
        </div>
        <div tw="flex flex-col items-center">
          <p tw="pt-6 text-center text-6xl font-extrabold">
            {props.description}
          </p>
        </div>
        <div tw="my-8 flex items-center text-neutral-300">
          <div tw="mx-8 flex items-center">
            <div tw="mx-8 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 16 16">
                <path fill="currentColor" d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815l4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97l.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45l2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084l2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456l-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183l-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z" />
              </svg>
              <p tw="ml-2 text-3xl font-bold">{stars}</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    {
      headers: {
        "Cache-Control": "s-maxage=86400, stale-while-revalidate",
      },
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
