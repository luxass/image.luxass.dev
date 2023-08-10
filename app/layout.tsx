import "./globals.css";

export const metadata = {
  title: "home | image.luxass.dev",
  description:
    "With a background as a fullstack developer. Lucas Norgaard builds both modern and scalable applications",
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
        url: "https://image.luxass.dev/og/text",
        width: 300,
        height: 300,
        alt: "image.luxass.dev",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head/>
      <body>{children}</body>
    </html>
  );
}
