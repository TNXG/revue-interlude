import { resolve } from "node:path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		head: {
			charset: "utf-8",
			viewport: "width=device-width, initial-scale=1",
			htmlAttrs: {
				lang: "zh-CN",
			},
		},
	},
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxt/icon", "@nuxt/fonts"],
	srcDir: "src/",
	alias: {
		"@": resolve(__dirname, "./src"),
	},
	typescript: {
		strict: true,
	},
	// 启用 SSR 模式
	ssr: true,
});
