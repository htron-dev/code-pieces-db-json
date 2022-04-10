/// <reference types="vitest" />

import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    resolve: {
        alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, "src", "index.ts"),
            name: "@code-piece/db-json",
            fileName: (format) => `index.${format}.js`,
            formats: ["es", "umd"],
        },
        rollupOptions: {
            external: ["vue"],
        },
    },
    test: {
        watch: false,
    },
});
