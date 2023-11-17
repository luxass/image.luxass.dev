// eslint-disable-next-line unicorn/prefer-node-protocol
import process from "process";
import { FONT_PARAMS } from "~/app/api/font/params";

const baseUrl = process.env.VERCEL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export async function font(family: string, weight?: number, text?: string) {
  const res = await fetch(
    `${baseUrl}/api/font?${FONT_PARAMS.toSearchString({
      family,
      weight,
      text,
    })}`, {
      next: {
        revalidate: 60 * 60 * 24 * 30, // 30 days
      },
    });

  return await res.arrayBuffer();
}
