// next doesn't support the node: protocol yet.
// eslint-disable-next-line unicorn/prefer-node-protocol
import process from "process";
import { ImageResponse } from "next/server";
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
      tw="bg-neutral-900 h-full w-full text-white bg-cover flex flex-col p-14"
      style={{ fontFamily: "Inter" }}
    >
      <div tw="flex flex-col justify-center gap-y-6 items-center w-full h-full">
        <div tw="flex items-center">
          <img
            src="https://assets.luxass.dev/logos/dino.svg"
            width="128px"
            height="128px"
            alt="luxass logo"
          />
          <h1 tw="text-6xl ml-8 font-extrabold">{props.repo}</h1>
        </div>
        <div tw="flex flex-col items-center">
          <p tw="text-center pt-6 text-6xl font-extrabold">
            {props.description}
          </p>
        </div>
        <div tw="flex items-center text-neutral-300 my-8">
          <div tw="flex items-center mx-8">
            <div tw="flex items-center mx-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={36}
                fill="#fff"
                viewBox="0 0 512 512"
              >
                <path d="M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9a17.56 17.56 0 003.8.4c8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1a102.4 102.4 0 01-22.6 2.7c-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1a63 63 0 0025.6-6c2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8a18.64 18.64 0 015-.5c8.1 0 26.4 3.1 56.6 24.1a208.21 208.21 0 01112.2 0c30.2-21 48.5-24.1 56.6-24.1a18.64 18.64 0 015 .5c12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5a19.35 19.35 0 004-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z" />
              </svg>
              <p tw="text-3xl font-bold ml-2">{stars}</p>
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
