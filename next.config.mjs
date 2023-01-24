/**
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineConfig(config) {
  return config;
}

export default defineConfig({
  experimental: {
    appDir: true
  },
  swcMinify: true
});
