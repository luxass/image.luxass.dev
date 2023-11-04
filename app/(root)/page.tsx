import Link from "next/link";
import type { Metadata } from "next/types";

export interface Props {}

export const runtime = "edge";

export const metadata = {
  metadataBase: new URL("https://luxass.dev/"),
  title: "home | image.luxass.dev",
  description:
     "With a background as a fullstack developer. Lucas Nørgård builds both modern and scalable applications",
  keywords:
      "lucas nørgård, web developer, fullstack, backend, website, lucas, luxass, nørgård",
  openGraph: {
    type: "website",
    siteName: "luxass.dev",
    url: "https://luxass.dev/",
    title: "home | image.luxass.dev",
    description:
        "With a background as a fullstack developer. Lucas Norgaard builds both modern and scalable applications",
    images: [
      {
        url: "https://image.luxass.dev/api/image/text",
        width: 300,
        height: 300,
        alt: "image.luxass.dev",
      },
    ],
  },
} satisfies Metadata;

export default function Home() {
  return (
    <main className="flex-1 p-4 flex items-center justify-center">
      <Link href="https://luxass.dev">have a good day 🩵</Link>
    </main>
  );
}
