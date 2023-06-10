import { ImageResponse } from "next/server";

export function GET(req: Request) {
  if (!req.url) return new Response("say whaaat", { status: 500 });
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "No title";
  const description = searchParams.get("description") || "No description";
  const date = searchParams.get("date") || "No date";


  return new ImageResponse(
    (
      <div tw="p-8 bg-stone-900 text-white flex w-full h-full">
        <div tw="flex flex-col flex-1">
          <p tw="text-xl">{date}</p>
          <h1 tw="text-7xl">{title}</h1>
          <p tw="text-2xl">{description}</p>
        </div>
        <div tw="w-86 flex items-end justify-end ml-4">
          <img src="https://raw.githubusercontent.com/luxass/luxass/main/assets/dino.png" width="256" height="256" />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}

