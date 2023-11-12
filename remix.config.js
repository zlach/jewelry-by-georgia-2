/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"],
  serverModuleFormat: "cjs",
  routes: async (defineRoutes) => {
    return defineRoutes((route) => {
      route("/", "routes/_home.tsx", {
        index: false,
      });
    });
  },
};
