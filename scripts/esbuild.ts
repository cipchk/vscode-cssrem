import * as esbuild from "esbuild";

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");
const buildType = watch ? "watch" : "build";

function esbuildProblemMatcherPlugin(type: "web" | "node"): esbuild.Plugin {
  const prefix = `[${buildType}/${type}]`;
  return {
    name: "esbuild-problem-matcher",
    setup(build) {
      build.onStart(() => {
        console.log(prefix + " started");
      });
      build.onEnd((result) => {
        result.errors.forEach(({ text, location }) => {
          console.error(`✘ [ERROR] ${text}`);
          if (location) {
            console.error(
              `    ${location.file}:${location.line}:${location.column}:`
            );
          }
        });
        console.log(prefix + " finished");
      });
    },
  };
}

const main = async () => {
  const nodeContext = await esbuild.context({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    format: "cjs",
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: "node",
    outfile: "out/extension.js",
    mainFields: ["module", "main"],
    external: ["vscode"],
    logLevel: "silent",
    plugins: [esbuildProblemMatcherPlugin("node")],
  });

  const browserContext = await esbuild.context({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    format: "cjs",
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: "browser",
    outfile: "out/extension.web.js",
    mainFields: ["browser", "module", "main"],
    external: ["vscode"],
    logLevel: "silent",
    plugins: [esbuildProblemMatcherPlugin("web")],
    // Node.js global to browser globalThis
    define: {
      global: "globalThis",
    },
  });

  if (watch) {
    await Promise.all([nodeContext.watch(), browserContext.watch()]);
  } else {
    await nodeContext.rebuild();
    await browserContext.rebuild();
    await nodeContext.dispose();
    await browserContext.dispose();
  }
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
