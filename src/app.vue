<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

const footerContentRef = ref<HTMLElement | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);

const adjustFont = () => {
	const el = footerContentRef.value;
	if (!el)
		return;
	el.style.fontSize = "";
	const parent = el.parentElement;
	if (!parent)
		return;

	const maxWidth = parent.clientWidth; // 移除多余缓冲，利用紧凑空间
	let fontSize = Number.parseFloat(getComputedStyle(el).fontSize);

	let steps = 0;
	// 稍微放宽最小字号限制，确保在极小屏幕也能缩放
	while ((el.scrollWidth > maxWidth) && fontSize > 8 && steps < 20) {
		fontSize -= 0.5;
		el.style.fontSize = `${fontSize}px`;
		steps++;
	}
};

onMounted(() => {
	nextTick(() => adjustFont());
	window.addEventListener("resize", adjustFont);
	if ("ResizeObserver" in window && footerContentRef.value) {
		resizeObserver.value = new ResizeObserver(() => adjustFont());
		resizeObserver.value.observe(footerContentRef.value);
	}
});

onBeforeUnmount(() => {
	window.removeEventListener("resize", adjustFont);
	if (resizeObserver.value && footerContentRef.value)
		resizeObserver.value.unobserve(footerContentRef.value);
});
</script>

<template>
	<NuxtPage />
	<!-- 注意：这里只展示 Footer 部分，请放入你的页面底部 -->
	<footer class="revue-compact-footer">
		<div class="ui-capsule">
			<div ref="footerContentRef" class="content-row">
				<!-- 极简 Position Zero 图标 -->
				<div class="pos-zero-mark">
					<div class="cross-line" />
				</div>

				<!-- 备案号：紧凑显示 -->
				<a href="https://beian.miit.gov.cn/" target="_blank" class="icp-link">
					新ICP备2025023032号-1
				</a>

				<!-- 装饰分割线 -->
				<div class="slash-divider">
					/
				</div>

				<!-- REVUE：原汁原味设计 -->
				<span class="project-revue">REVUE</span>
			</div>

			<!-- 底部发光条 -->
			<div class="bottom-accent" />
		</div>
	</footer>
</template>

<style>
:root {
	font-family: "Noto Sans SC", sans-serif;
}

:lang(ja-sans) {
	font-family: "Noto Sans JP", sans-serif;
}

:lang(ja-serif) {
	font-family: "Noto Serif JP", serif;
}

:lang(zh-serif) {
	font-family: "Noto Serif SC", serif;
}
</style>

<style scoped lang="scss">
/* 变量：提取自少女歌剧 UI 风格 */
$ui-bg: rgba(20, 10, 15, 0.75); // 深色半透明背景，适配红色底
$ui-border: rgba(255, 215, 0, 0.3); // 淡金边框
$text-main: #e0e0e0;
$text-gold: #ffd700;
$accent-red: #e4002b;

.revue-compact-footer {
	position: fixed;
	bottom: 1rem;
	left: 50%;
	transform: translateX(-50%);
	z-index: 9999;
	width: auto;
	max-width: 95vw;
	pointer-events: none; /* 容器透传点击，内容响应点击 */
}

.ui-capsule {
	pointer-events: auto;
	position: relative;
	background: $ui-bg;
	border: 1px solid $ui-border;
	border-radius: 20px; /* 全圆角胶囊 */
	padding: 0.35rem 0.8rem; /* 极度紧凑的内边距 */
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
	overflow: hidden;
	transition:
		transform 0.3s ease,
		border-color 0.3s ease;

	display: flex;
	justify-content: center;
	align-items: center;
}

.ui-capsule:hover {
	transform: scale(1.02);
	border-color: rgba($text-gold, 0.6);
	background: rgba(30, 15, 20, 0.85);
}

.content-row {
	display: flex;
	align-items: center;
	gap: 0.5rem; /* 元素间距紧凑 */
	white-space: nowrap;
	font-size: 12px; /* 默认小字号 */
	line-height: 1;
	color: $text-main;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* --- 1. Position Zero 极简图标 --- */
.pos-zero-mark {
	width: 14px;
	height: 14px;
	border: 1.5px solid $text-gold;
	border-radius: 50%;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0.9;
}

/* 中间的 T 型/十字 */
.pos-zero-mark .cross-line {
	width: 60%;
	height: 60%;
	border-top: 1.5px solid $text-gold;
	border-left: 1.5px solid $text-gold;
	transform: translateY(10%) rotate(45deg);
}

/* --- 2. 备案号链接 --- */
.icp-link {
	color: $text-main;
	text-decoration: none;
	font-weight: 400;
	opacity: 0.9;
	transition: color 0.2s;
	font-feature-settings: "tnum"; /* 等宽数字 */
}

.icp-link:hover {
	color: #fff;
	text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

/* --- 3. 分割线 --- */
.slash-divider {
	color: rgba(255, 255, 255, 0.2);
	font-size: 0.9em;
	transform: translateY(-0.5px);
}

/* --- 4. REVUE 字体 --- */
.project-revue {
	color: $text-gold;
	font-weight: 700; /* 加粗 */
	letter-spacing: 0.05em;
	font-size: 0.95em; /* 稍微大一点点 */
	text-transform: uppercase;
	/* 保持原来设计的无衬线 */
	font-family: inherit;
	text-shadow: 0 0 10px rgba($text-gold, 0.3);
}

/* --- 底部红色装饰条 (UI 质感) --- */
.bottom-accent {
	position: absolute;
	bottom: 0;
	left: 20%;
	right: 20%;
	height: 1.5px;
	background: linear-gradient(90deg, transparent, $accent-red, transparent);
	opacity: 0.8;
}

/* 移动端极窄屏幕适配 */
@media (max-width: 360px) {
	.ui-capsule {
		padding: 0.3rem 0.6rem;
	}
	.content-row {
		gap: 0.3rem;
	}
	/* 在极小屏幕隐藏 Position Zero 图标以保全文字 */
	.pos-zero-mark {
		display: none;
	}
}
</style>
