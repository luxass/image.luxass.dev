import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content="20; url=https://luxass.dev/" />
      </head>
      <body>{children}</body>
    </html>
  );
}
