import { render } from "./render";
import type { ImageResponseOptions } from "./types";

export class ImageResponse extends Response {
  constructor(
    element: string | React.ReactNode,
    options: ImageResponseOptions,
  ) {
    super();

    // if (options.format === "svg") {
    //   return (async () => {
    //     const svg = await render({ element, options });
    //     return new Response(svg, {
    //       headers: {
    //         "Content-Type": "image/svg+xml",
    //         "Cache-Control": options.debug
    //           ? "no-cache, no-store"
    //           : "public, immutable, no-transform, max-age=31536000",
    //         ...options.headers,
    //       },
    //       status: options.status || 200,
    //       statusText: options.statusText,
    //     });
    //   })() as unknown as ImageResponse;
    // } else {
    const body = new ReadableStream({
      async start(controller) {
        const buffer = await render({
          element,
          options,
        });

        controller.enqueue(buffer);
        controller.close();
      },
    });

    return new Response(body, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": options.debug
          ? "no-cache, no-store"
          : "public, immutable, no-transform, max-age=31536000",
        ...options.headers,
      },
      status: options.status || 200,
      statusText: options.statusText,
    });
    // }
  }
}
