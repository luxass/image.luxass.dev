export default function RootLayout2({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content="5; url=https://luxass.dev/" />
      </head>
      <body>{children}</body>
    </html>
  );
}
