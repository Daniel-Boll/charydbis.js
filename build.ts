import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/**/*.ts", "example/**/*.ts"],
	splitting: true,
	sourcemap: true,
	clean: true,
	outDir: "distTsUp",
});
