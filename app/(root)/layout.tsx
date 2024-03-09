import process from "process";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {process.env.NODE_ENV === "production" && (
          <meta httpEquiv="refresh" content="5; url=https://luxass.dev/" />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
