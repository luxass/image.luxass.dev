import Image from "next/image";
import { POST_PARAMS } from "~/app/api/image/post/params";
import { PROJECT_PARAMS } from "~/app/api/image/project/params";
import { RANDOM_EMOJI_PARAMS } from "~/app/api/image/random-emoji/params";
import { TEXT_PARAMS } from "~/app/api/image/text/params";

export interface Props { }

export const runtime = "edge";

export default function Home() {
  return (
    <main className="prose flex-1 p-4">
      <div>
        <h2>Post</h2>
        <Image
          className="border"
          src={`/api/image/post?${POST_PARAMS.toSearchString({
            date: "2023-09-27",
            title:
              "Does this even work? I don't know, but I hope it does. So im going to write a really long title to test it out",
            description:
              "Did that work, or do i need to test description too?",
          })}`}
          alt="OG Image of a Post"
          width="1200"
          height="600"
        />
      </div>

      <div>
        <h2>Project</h2>
        <Image
          className="border"
          src={`/api/image/project?${PROJECT_PARAMS.toSearchString({
            repo: "luxass/eslint-config",
            description: "A really cool eslint config",
          })}`}
          alt="OG Image of a Project"
          width="1200"
          height="600"
        />
      </div>

      <div>
        <h2>Text</h2>
        <Image
          className="border"
          src={`/api/image/text?${TEXT_PARAMS.toSearchString({
            bgColor: "stone-900",
            fontSize: 4,
            height: 300,
            text: "Hello World",
            textColor: "white",
            width: 300,
          })}`}
          alt="OG Image of Text"
          width="300"
          height="300"
        />
      </div>

      <div>
        <h2>Random Emoji</h2>
        <Image
          className="border"
          src={`/api/image/random-emoji?${RANDOM_EMOJI_PARAMS.toSearchString({
            bgColor: "stone-900",
            fontSize: 4,
            height: 300,
            width: 300,
          })}`}
          alt="A random emoji"
          width="300"
          height="300"
        />
      </div>
    </main>
  );
}
