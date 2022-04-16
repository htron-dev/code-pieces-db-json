/// <reference types="vitest" />

import path from "path";
import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
    plugins: [
        typescript({
            target: "esnext",
            declaration: true,
            rootDir: path.resolve(__dirname, "src"),
            declarationDir: path.resolve(__dirname, "dist"),
            exclude: ["*.spec.ts"],
        }),
    ],
    resolve: {
        alias: [
            { find: "@/test", replacement: path.resolve(__dirname, "test") },
            { find: "@", replacement: path.resolve(__dirname, "src") },
        ],
    },
    build: {
        target: "node12",
        lib: {
            entry: path.resolve(__dirname, "src", "index.ts"),
            name: "@code-piece/db-json",
            fileName: (format) => `index.${format}.js`,
            formats: ["es", "umd"],
        },
        rollupOptions: {
            external: ["fs"],
        },
    },
    test: {
        watch: false,
    },
});
