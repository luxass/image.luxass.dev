import satori, { init } from "satori/wasm";
import initYoga from "yoga-wasm-web";
import { Resvg, initWasm } from "@resvg/resvg-wasm";
// @ts-expect-error .wasm files are not typed
import resvgWasm from "./resvg.wasm";
// @ts-expect-error .wasm files are not typed
import yogaWasm from "./yoga.wasm";
import type { ImageResponseOptions } from "./types";
import { font } from "./utils";

async function initResvgWasm() {
  try {
    await initWasm(resvgWasm as WebAssembly.Module);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Already initialized")) {
      return;
    }
    throw err;
  }
}

async function initYogaWasm() {
  // eslint-disable-next-line no-useless-catch
  try {
    const yoga = await initYoga(yogaWasm);
    await init(yoga);
  } catch (err) {
    throw err;
  }
}

interface RenderOptions {
  /**
   * The React element to render into an image.
   * @example
   * ```tsx
   * <div
   *  style={{
   *    display: 'flex',
   *  }}
   * >
   *  <h1>Hello World</h1>
   * </div>
   * ```
   * @example
   * ```html
   * <div style="display:flex;"><h1>Hello World</h1></div>
   * ```
   */
  element: React.ReactNode;
  /**
   * The options for the image response.
   */
  options: ImageResponseOptions;
}

const apis = {
  twemoji: (code: string) => `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${code.toLowerCase()}.svg`,
  openmoji: "https://cdn.jsdelivr.net/npm/@svgmoji/openmoji@2.0.0/svg/",
  blobmoji: "https://cdn.jsdelivr.net/npm/@svgmoji/blob@2.0.0/svg/",
  noto: "https://cdn.jsdelivr.net/gh/svgmoji/svgmoji/packages/svgmoji__noto/svg/",
  fluent: (code: string) => `https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/${code.toLowerCase()}_color.svg`,
  fluentFlat: (code: string) => `https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/${code.toLowerCase()}_flat.svg`,
} as any;

function loadEmoji(code: string, type: string) {
  if (!type || !apis[type]) {
    type = "twemoji";
  }
  const api = apis[type];
  if (typeof api === "function") {
    return fetch(api(code));
  }
  return fetch(`${api}${code.toUpperCase()}.svg`);
}

const U200D = String.fromCharCode(8205);
const UFE0Fg = /\uFE0F/g;
function getIconCode(char: string) {
  return toCodePoint(!char.includes(U200D) ? char.replace(UFE0Fg, "") : char);
}

function toCodePoint(unicodeSurrogates: string) {
  const r = [];
  let c = 0;
  let p = 0;
  let i = 0;
  while (i < unicodeSurrogates.length) {
    c = unicodeSurrogates.charCodeAt(i++);
    if (p) {
      r.push((65536 + (p - 55296 << 10) + (c - 56320)).toString(16));
      p = 0;
      // eslint-disable-next-line yoda
    } else if (55296 <= c && c <= 56319) {
      p = c;
    } else {
      r.push(c.toString(16));
    }
  }
  return r.join("-");
}

export async function render({ element, options }: RenderOptions) {
  await initResvgWasm();
  await initYogaWasm();
  // const a = await Promise.allSettled([initResvgWasm(), initYogaWasm()]);
  // console.log(a)

  const width = options.width;
  const height = options.height;

  let widthHeight:
    | { width: number; height: number }
    | { width: number }
    | { height: number } = {
      width: 1200,
      height: 630,
    };

  if (width && height) {
    widthHeight = { width, height };
  } else if (width) {
    widthHeight = { width };
  } else if (height) {
    widthHeight = { height };
  }

  const svg = await satori(element, {
    ...widthHeight,
    fonts: options?.fonts?.length
      ? options.fonts
      : [
          {
            name: "Inter",
            data: await font({
              family: "Inter",
              weight: 500,
            }),
            weight: 500,
            style: "normal",
          },
        ],
    async loadAdditionalAsset(languageCode, segment) {
      if (languageCode === "emoji") {
        return `data:image/svg+xml;base64,${btoa(await (await loadEmoji(getIconCode(segment), "twemoji")).text())}`;
      }

      console.error("Unsupported language code", languageCode, segment);

      throw new Error("Unsupported language code");
    },
  });

  const resvg = new Resvg(svg, {
    fitTo:
      "width" in widthHeight
        ? {
            mode: "width" as const,
            value: widthHeight.width,
          }
        : {
            mode: "height" as const,
            value: widthHeight.height,
          },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return pngBuffer;
}
