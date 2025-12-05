<script setup lang="ts">
import { onMounted, ref } from "vue";

const containerRef = ref();
const nextSectionRef = ref();
const nextContentRef = ref();
const watashiRef = ref <any> (null);
const isWatashiReady = ref(false);
// 是否允许翻转（仅当滚动进入下一阶段内容出现后）
const canFlip = ref(false);
// 翻转激活的滚动进度阈值（与第二阶段开始同步）
const flipActivationProgress = 0.6;

const initScrollAnimation = () => {
	const { $gsap } = useNuxtApp();
	if (!$gsap || !containerRef.value || !nextSectionRef.value)
		return;

	const leftRef = watashiRef.value?.leftRef;
	const rightRef = watashiRef.value?.rightRef;

	if (!leftRef || !rightRef || !nextContentRef.value)
		return;

	// 获取第二页的所有内容元素
	const contentElements = $gsap.utils.toArray(
		(nextContentRef.value).querySelectorAll(".flip-face > *"),
	);

	// 初始隐藏下一页“文本内容”，背景保持可见
	$gsap.set(nextContentRef.value, { opacity: 0 });
	// 初始隐藏内容元素，为入场动画准备
	$gsap.set(contentElements, { opacity: 0, y: 20 });

	// 统一的时间线：固定容器，左右抽出 + 背景显现
	const tl = $gsap.timeline({
		scrollTrigger: {
			trigger: containerRef.value,
			start: "top top",
			end: "+=150%", // 延长滚动区间，为两段动画留空间
			scrub: 1,
			pin: true,
			anticipatePin: 1,
			pinSpacing: true,
			invalidateOnRefresh: true,
			pinType: "fixed",
			onUpdate: (self: any) => {
				// 根据滚动进度动态启用/禁用翻转
				canFlip.value = self.progress >= flipActivationProgress;
			},
		},
	});

	// 第一阶段：SVG 左右抽出（0 - 0.6）
	tl.to(leftRef, { x: -1200, opacity: 0, ease: "power2.out", force3D: true }, 0)
		.to(rightRef, { x: 1200, opacity: 0, ease: "power2.out", force3D: true }, 0)
		// 第二阶段：SVG 抽出完成后，“文本内容容器”再显现（0.6 - 0.8）
		.to(nextContentRef.value, { opacity: 1, ease: "power1.inOut" }, 0.6)
		// 第三阶段：内容元素逐个入场 (0.8 - ...)
		.to(contentElements, {
			opacity: 1,
			y: 0,
			ease: "power2.out",
			stagger: 0.15, // 逐个动画
			force3D: true,
		}, 0.8); // 在容器显现后开始
};

const onWatashiReady = () => {
	isWatashiReady.value = true;
	initScrollAnimation();
};

// 检测是否为触屏设备
const isTouchDevice = ref(false);

// 点击内容翻转：正面（日文）/ 背面（中文）
const isFlipped = ref(false);
const clickCount = ref(0);
const clickTimer = ref <number> (0);

const toggleFlip = () => {
	// 尚未进入内容阶段时禁止任何翻转/彩蛋逻辑
	if (!canFlip.value)
		return;
	clickCount.value++;

	// 如果是第一次点击，启动计时器
	if (clickCount.value === 1) {
		clickTimer.value = window.setTimeout(() => {
			clickCount.value = 0;
		}, 500); // 500ms 内完成三次点击
	}

	// 检测三连击
	if (clickCount.value === 3) {
		if (clickTimer.value)
			window.clearTimeout(clickTimer.value);
		clickCount.value = 0;
		// 跳转到大场奈奈彩蛋页面
		navigateTo("/nana", { external: true });
		return;
	}

	// 正常翻转
	isFlipped.value = !isFlipped.value;
};

onMounted(() => {
	// 检测触屏设备
	isTouchDevice.value
		= "ontouchstart" in window
			|| navigator.maxTouchPoints > 0;
});
</script>

<template>
	<div ref="containerRef" class="app-container">
		<Flower v-if="!isTouchDevice" />
		<div class="svg-layer">
			<Atashi ref="watashiRef" @ready="onWatashiReady" />
		</div>
		<section ref="nextSectionRef" class="next-section" :class="{ 'is-ready': isWatashiReady }">
			<div
				ref="nextContentRef" class="content" :class="{ 'is-flipped': isFlipped, 'is-active': canFlip }" role="button"
				aria-pressed="false" tabindex="0" @click="toggleFlip"
			>
				<div class="flip-inner">
					<!-- 正面：日文 -->
					<div class="flip-face flip-front" lang="ja-sans">
						<div class="star-decoration top">
							★
						</div>
						<h1 class="stage-title">
							運命の舞台は、その時を待つ
						</h1>
						<div class="spotlight-line" />
						<p class="stage-message">
							開演のベルは、間もなく鳴り響く<br>
							新たなキラめきが、生まれようとしている<br>
							刮目して待て<br>
							<span class="stage-highlight">わかります</span>
						</p>
						<div class="star-decoration bottom">
							★
						</div>
					</div>

					<!-- 背面：中文 -->
					<div class="flip-face flip-back">
						<div class="star-decoration top">
							★
						</div>
						<h1 class="stage-title">
							命运之舞台，正等待那一刻
						</h1>
						<div class="spotlight-line" />
						<p class="stage-message">
							开演的铃声，即将鸣响<br>
							全新的闪耀，即将诞生<br>
							拭目以待吧<br>
							<span class="stage-highlight">我明白的</span>
						</p>
						<div class="star-decoration bottom">
							★
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<style scoped lang="scss">
.app-container {
	position: relative;
	width: 100%;
	height: 100svh; // 移动端安全区域适配
	overflow: hidden;
}

.svg-layer {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 2;
	pointer-events: none;
}

.next-section {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: grid;
	place-items: center;
	background: #fc5558; // 保持红色背景
	color: #fff;
	text-align: center;
	padding: 2rem;
	box-sizing: border-box; // 修复：确保 padding 不增加总宽度导致偏离中心
	z-index: 1; // 在 SVG 下方
	user-select: none;
	-webkit-user-select: none;
	-webkit-tap-highlight-color: transparent; // 移除移动端点击高亮

	// 默认仅隐藏文本内容，避免文字闪烁；背景始终可见
	.content {
		opacity: 0; // 由 GSAP 控制
		position: relative;
		perspective: 1200px;
		outline: none;
		pointer-events: none; // 初始禁止点击
		cursor: default;
		max-width: 95%; // 限制内容宽度，确保居中
		width: 100%;
		-webkit-tap-highlight-color: transparent; // 移除移动端点击高亮
	}

	.content.is-active {
		pointer-events: auto; // 激活后允许点击翻转
		cursor: pointer;
	}

	.flip-face > * {
		// 初始状态由 GSAP set 控制，这里是回退
		opacity: 0;
		transform: translateY(20px);
		text-align: center;
		width: 100%;
		max-width: 100%;
	}

	/* 翻转容器 */
	.flip-inner {
		position: relative;
		transform-style: preserve-3d;
		transition: transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
		width: 100%;
		text-align: center;
	}

	.content.is-flipped .flip-inner {
		transform: rotateY(180deg);
	}

	.flip-face {
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		width: 100%;
	}

	.flip-back {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		transform: rotateY(180deg);
	}

	h1 {
		font-size: clamp(2rem, 5vw, 4rem);
		margin-bottom: 1rem;
		font-weight: 700;
		text-align: center;
		width: 100%;
	}

	p {
		font-size: clamp(1rem, 2.5vw, 1.5rem);
		max-width: 40rem;
		line-height: 1.6;
		text-align: center;
		margin-left: auto;
		margin-right: auto;
		width: 100%;
	}

	// Revue Starlight 舞台风格
	.star-decoration {
		font-size: clamp(2rem, 4vw, 3rem);
		color: #ffd700;
		text-shadow:
			0 0 20px rgba(255, 215, 0, 0.8),
			0 0 30px rgba(255, 215, 0, 0.6);
		animation: twinkle 2s ease-in-out infinite;
		text-align: center;
		width: 100%;

		&.top {
			margin-bottom: 1.5rem;
		}

		&.bottom {
			margin-top: 1.5rem;
		}
	}

	.stage-title {
		font-size: clamp(1.8rem, 6.5vw, 4.2rem);
		font-weight: 700;
		letter-spacing: 0.08em;
		margin-bottom: 1.5rem;
		text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
		max-width: 100%;
		word-break: keep-all; // 防止日文不合理断行
		text-align: center;
		margin-left: auto;
		margin-right: auto;
		white-space: nowrap; // 强制单行
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.spotlight-line {
		width: 80px;
		height: 3px;
		background: linear-gradient(90deg, transparent 0%, #ffd700 50%, transparent 100%);
		margin: 1.5rem auto;
		box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
	}

	.stage-message {
		font-size: clamp(1rem, 3.2vw, 1.6rem);
		line-height: 2;
		letter-spacing: 0.05em;
		margin-top: 2rem;
		font-weight: 300;
		text-align: center;
		margin-left: auto;
		margin-right: auto;
	}

	.stage-highlight {
		display: inline-block;
		margin-top: 1rem;
		font-weight: 700;
		color: #ffd700;
		text-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
		font-size: 1.1em;
		letter-spacing: 0.12em;
	}
}

@media (max-width: 640px) {
	.next-section {
		padding: 2rem 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.next-section .content {
		padding: 0 1rem;
	}
	.next-section .stage-title {
		font-size: clamp(1.2rem, 5.8vw, 2.2rem);
		letter-spacing: 0.02em;
		margin-bottom: 1rem;
		line-height: 1.3;
		white-space: nowrap;
	}
	.next-section .stage-message {
		font-size: clamp(0.9rem, 4vw, 1.3rem);
		line-height: 1.75;
		margin-top: 1.5rem;
	}
	.next-section .star-decoration {
		font-size: clamp(1.6rem, 6vw, 2.4rem);
	}
	.next-section .stage-highlight {
		font-size: 1em;
		letter-spacing: 0.08em;
	}
	.next-section .flip-inner {
		transition-duration: 0.7s;
	}
}

@media (max-width: 400px) {
	.next-section {
		padding: 1.5rem 0;
	}
	.next-section .content {
		padding: 0 0.8rem;
	}
	.next-section .stage-title {
		font-size: clamp(1rem, 5.2vw, 1.9rem);
		letter-spacing: 0.01em;
		line-height: 1.25;
		white-space: nowrap;
	}
	.next-section .stage-message {
		font-size: clamp(0.85rem, 4.6vw, 1.15rem);
	}
	.next-section .star-decoration {
		font-size: clamp(1.4rem, 7vw, 2rem);
	}
}

@keyframes twinkle {
	0%,
	100% {
		opacity: 1;
		transform: scale(1);
	}

	50% {
		opacity: 0.7;
		transform: scale(1.1);
	}
}
</style>

<style lang="scss">
// 全局样式：隐藏滚动条但保留滚动功能
html {
	overscroll-behavior: none; // 防止过度滚动
}

body {
	overscroll-behavior: none;
	margin: 0;
	padding: 0;
}

// 隐藏所有滚动条但保留滚动功能
::-webkit-scrollbar {
	display: none;
}

* {
	-ms-overflow-style: none; // IE and Edge
	scrollbar-width: none; // Firefox
	box-sizing: border-box; // 修复：确保全局盒模型一致，避免 padding 撑大元素
}
</style>
