import { ImageResponse } from "next/server";

export function GET(req: Request) {
  if (!req.url) return new Response("say whaaat", { status: 500 });
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "No title";
  const date = searchParams.get("date") || "No date";
  const image = searchParams.get("image");

  return new ImageResponse(
    (
      <div tw="p-8 bg-stone-900 flex w-full h-full">
        <div tw="flex flex-col flex-1">
          <p tw="text-xl">{date}</p>
          <h1 tw="text-7xl">{title}</h1>
        </div>
        <div tw="border-4 border-black rounded-lg w-86 flex items-center justify-center ml-4">
          {image ?
              (
                <p>Hey!</p>
              ) :
              (
               <>
                 <img src="https://raw.githubusercontent.com/luxass/luxass/main/assets/dino.png" width="320" height="320" />
               </>
              )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}

