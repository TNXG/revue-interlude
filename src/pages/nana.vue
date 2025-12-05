<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const containerRef = ref<HTMLElement | null>(null);
const shutterTopRef = ref<HTMLElement | null>(null);
const shutterBottomRef = ref<HTMLElement | null>(null);

// 状态管理
const loopCount = ref(99);
const isShutterActive = ref(false);
const currentQuoteIndex = ref(0);

useSeoMeta({
	title: "Re-performance of Nana | 天翔TNXG的自留地",
	robots: "noindex",
});

// 监控 loopCount，超过 120 则跳转
watch(loopCount, (newValue) => {
	if (newValue > 120) {
		navigateTo("https://www.bilibili.com/video/BV1Mst5z6EL1", { external: true });
	}
});

// 奈奈的台词库（双语版） - 扩充版
const quotes = [
	// --- 原有台词 ---
	{ text: "みんな、私が守るから。", trans: "大家，由我来守护。" },
	{ text: "このままでいい、これがいい。", trans: "这样就好，这样最好。" },
	{ text: "眩しい... あの頃のまま。", trans: "好耀眼... 就和那时候一样。" },
	{ text: "再演... しなきゃ。", trans: "必须... 再演。" },
	{ text: "届かない、星の輝き。", trans: "无法触及，那星之光辉。" },
	{ text: "バナナ、ナイス！", trans: "Banana, Nice!" },
	{ text: "時間が止まればいいのに。", trans: "如果时间能停止就好了。" },
	{ text: "次の舞台なんて、いらない。", trans: "下一个舞台什么的，我不需要。" },

	// --- 新增台词 (TV动画版) ---
	{
		text: "舞台に実ったたわわな果実。私が守るの、ずっと、何度でも！",
		trans: "舞台上结出的丰硕果实。但这大家太过柔嫩，必须有人来守护才行。我会守护大家的，永远，无论多少次！",
	},
	{ text: "ずっと待ってる。", trans: "我会一直等着。" },

	// --- 新增台词 (剧场版 - 皆杀的Revue / 狩猎的Revue) ---
	{
		text: "今は今はと言い訳重ね、生き恥晒した醜い果実。星の遠きに望みを絶たれ、君、今死にたもうことなかれ。",
		trans: "“现在也好，现在也好”，堆砌着借口，曝晒出生存之耻的丑陋果实。对那遥远星辰的渴望既已断绝，你，如今切莫死去。",
	},
	{
		text: "熟れて堕ちゆく運命なら、今、君に美しい最期を。",
		trans: "若命运注定熟透坠落，此刻，便赐予你美丽的终结。",
	},
	{ text: "なんだか、強いお酒を飲んだみたい。", trans: "总觉得，像是喝了烈酒一样。" },
	{ text: "お前、なんで舞台に立ってるの？", trans: "你，为什么站在舞台上？" },
	{ text: "終わったのかもしれない、私の再演が今。", trans: "或许已经结束了，我的再演，就在此刻。" },
	{ text: "私たちはもう、舞台の上。", trans: "我们已经，站在舞台上了。" },
	{ text: "演じきってみせてよ、星見純那。", trans: "演到底给我看啊，星见纯那。" },
];

// 格式化循环次数，模拟大数值
const formattedLoopCount = computed(() => {
	return loopCount.value.toString().padStart(6, "0");
});

// 触发快门与轮回逻辑
const triggerShutter = () => {
	if (isShutterActive.value)
		return;

	const { $gsap } = useNuxtApp();
	if (!$gsap)
		return;

	isShutterActive.value = true;

	// 1. 快门闭合动画
	const tl = $gsap.timeline({
		onComplete: () => {
			isShutterActive.value = false;
		},
	});

	// 声音效果（可选，这里仅做视觉）

	tl.to([shutterTopRef.value, shutterBottomRef.value], {
		height: "51%", // 闭合，稍微重叠一点防止漏光
		duration: 0.1,
		ease: "power4.in",
	})
		.call(() => {
			// 在黑暗中切换状态
			loopCount.value++;
			// 随机或顺序切换台词
			currentQuoteIndex.value = (currentQuoteIndex.value + 1) % quotes.length;

			// 彩蛋：极低概率重置（模拟无限循环的绝望感或跳出）
			if (Math.random() > 0.95 && loopCount.value > 105) {
				// loopCount.value = 99; // 可选：重置
			}
		})
		.to([shutterTopRef.value, shutterBottomRef.value], {
			height: "0%", // 打开
			duration: 0.25,
			delay: 0.1, // 稍微停顿
			ease: "power2.out",
		});
};

// 退出彩蛋回到主页
const exitMemory = () => {
	router.push("/");
};

onMounted(() => {
	const { $gsap } = useNuxtApp();
	if (!$gsap || !containerRef.value)
		return;

	// 背景元素的缓慢漂浮/旋转动画，象征凝固的时间
	$gsap.to(".floating-element", {
		y: "random(-20, 20)",
		rotation: "random(-10, 10)",
		duration: "random(3, 6)",
		repeat: -1,
		yoyo: true,
		ease: "sine.inOut",
		stagger: 0.5,
	});

	// 齿轮/星轨的持续旋转
	$gsap.to(".bg-gear", {
		rotation: 360,
		duration: 60,
		repeat: -1,
		ease: "none",
	});
});
</script>

<template>
	<div ref="containerRef" class="nana-page" lang="zh-serif" @click="triggerShutter">
		<!-- 动态背景层 -->
		<div class="background-layer">
			<div class="stars" />
			<!-- 象征循环的齿轮/光环 -->
			<svg class="bg-gear" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
				<circle
					cx="100" cy="100" r="90" fill="none" stroke="#ffd700" stroke-width="1" stroke-dasharray="10 5"
					opacity="0.1"
				/>
				<circle cx="100" cy="100" r="70" fill="none" stroke="#ffd700" stroke-width="0.5" opacity="0.1" />
				<path
					d="M100 10 L100 0 M100 200 L100 190 M10 100 L0 100 M200 100 L190 100" stroke="#ffd700"
					stroke-width="2" opacity="0.3"
				/>
			</svg>
		</div>

		<!-- 相机取景器 UI -->
		<div class="viewfinder-ui">
			<!-- 四角标记 -->
			<div class="corner top-left" />
			<div class="corner top-right" />
			<div class="corner bottom-left" />
			<div class="corner bottom-right" />

			<!-- 顶部信息 -->
			<div class="ui-top">
				<div class="top-left-group">
					<div class="mode-badge">
						REC
					</div>
					<div class="location-tag" lang="ja-serif">
						第99回聖翔祭
					</div>
				</div>
				<div class="top-right-group">
					<div class="time-code">
						REPEAT_NO.{{ formattedLoopCount }}
					</div>
					<div class="battery-icon">
						<div class="battery-level" />
					</div>
				</div>
			</div>

			<!-- 中心焦点区域 -->
			<div class="center-focus">
				<div class="focus-bracket" />

				<!-- 核心文本内容 -->
				<div class="content-text">
					<transition name="fade" mode="out-in">
						<div :key="currentQuoteIndex" class="quote-container">
							<p class="quote-jp" lang="ja-serif">
								{{ quotes[currentQuoteIndex]?.text }}
							</p>
							<p class="quote-cn" lang="zh-serif">
								{{ quotes[currentQuoteIndex]?.trans }}
							</p>
						</div>
					</transition>
					<div class="sub-text">
						<span class="icon">◉</span> 点击快门 · 捕捉记忆
					</div>
				</div>
			</div>

			<!-- 底部信息 -->
			<div class="ui-bottom">
				<div class="data-block">
					<span>ISO 800</span>
					<span>F1.8</span>
					<span>1/60</span>
				</div>
				<!-- 退出按钮 -->
				<button class="exit-btn" @click.stop="exitMemory">
					<span class="en">EXIT LOOP</span>
					<span class="cn">跳出循环</span>
				</button>
			</div>
		</div>

		<!-- 装饰元素：漂浮的香蕉/星星抽象符号 -->
		<div class="floating-props">
			<span class="floating-element banana-shape">🍌</span>
			<span class="floating-element star-shape">✨</span>
			<span class="floating-element star-shape sm">✨</span>
		</div>

		<!-- 快门遮罩 -->
		<div ref="shutterTopRef" class="shutter shutter-top" />
		<div ref="shutterBottomRef" class="shutter shutter-bottom" />
	</div>
</template>

<style scoped lang="scss">
// 变量定义
$nana-yellow: #ffd700;
$nana-dark: #1a1a1a;
$bg-black: #050505;

.nana-page {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100svh;
	background-color: $bg-black;
	color: $nana-yellow;
	overflow: hidden;
	cursor: pointer;
	font-family: "Courier New", Courier, monospace; // 复古数字感
	user-select: none;
}

/* 背景层 */
.background-layer {
	position: absolute;
	inset: 0;
	z-index: 0;
	opacity: 0.6;
	pointer-events: none;
}

.bg-gear {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 120vmax; // 足够大覆盖屏幕
	height: 120vmax;
	transform: translate(-50%, -50%);
	opacity: 0.15;
}

/* UI 层 */
.viewfinder-ui {
	position: absolute;
	inset: 2rem;
	z-index: 10;
	border: 1px solid rgba($nana-yellow, 0.3);
	box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.5);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	pointer-events: none; // 让点击穿透到底层容器

	// 移动端适配
	@media (max-width: 600px) {
		inset: 1rem;
	}
}

.corner {
	position: absolute;
	width: 20px;
	height: 20px;
	border-color: $nana-yellow;
	border-style: solid;
	transition: all 0.3s ease;

	&.top-left {
		border-width: 3px 0 0 3px;
		top: -1px;
		left: -1px;
	}

	&.top-right {
		border-width: 3px 3px 0 0;
		top: -1px;
		right: -1px;
	}

	&.bottom-left {
		border-width: 0 0 3px 3px;
		bottom: -1px;
		left: -1px;
	}

	&.bottom-right {
		border-width: 0 3px 3px 0;
		bottom: -1px;
		right: -1px;
	}
}

/* 顶部 UI */
.ui-top {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 1rem;
	font-size: 0.9rem;
	letter-spacing: 0.1em;
	text-shadow: 0 0 5px rgba($nana-yellow, 0.5);
}

.top-left-group,
.top-right-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.top-right-group {
	align-items: flex-end;
}

.mode-badge {
	background: $nana-yellow;
	color: $bg-black;
	padding: 2px 6px;
	font-weight: bold;
	border-radius: 2px;
	animation: blink 2s infinite;
	align-self: flex-start;
}

.location-tag {
	font-size: 0.8rem;
	opacity: 0.8;
	font-family: sans-serif; // 用无衬线字体显示地点，区分度高
}

.battery-icon {
	width: 24px;
	height: 10px;
	border: 1px solid $nana-yellow;
	padding: 1px;
	position: relative;

	&::after {
		content: "";
		position: absolute;
		right: -3px;
		top: 2px;
		width: 2px;
		height: 4px;
		background: $nana-yellow;
	}

	.battery-level {
		width: 80%;
		height: 100%;
		background: $nana-yellow;
	}
}

/* 中心内容 */
.center-focus {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.focus-bracket {
	width: 150px;
	height: 100px;
	border: 1px solid rgba($nana-yellow, 0.5);
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	&::before,
	&::after {
		content: "";
		position: absolute;
		top: 50%;
		left: 50%;
		background: $nana-yellow;
		transform: translate(-50%, -50%);
	}

	// 十字准星
	&::before {
		width: 10px;
		height: 1px;
	}

	&::after {
		width: 1px;
		height: 10px;
	}
}

.content-text {
	position: relative;
	z-index: 2;
	margin-top: 160px; // 移出准星区域
	width: 90%;
	max-width: 600px;
}

.quote-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	min-height: 4em;
}

.quote-jp {
	font-size: 1.4rem;
	font-weight: bold;
	margin: 0;
	text-shadow: 0 0 10px rgba($nana-yellow, 0.8);
	font-family: "Noto Serif JP", serif; // 日文尝试用衬线体更有戏剧感

	@media (max-width: 600px) {
		font-size: 1.1rem;
	}
}

.quote-cn {
	font-size: 1rem;
	opacity: 0.8;
	margin: 0;
	font-family: "Noto Sans SC", sans-serif;
	font-weight: 300;

	@media (max-width: 600px) {
		font-size: 0.9rem;
	}
}

.sub-text {
	font-size: 0.7rem;
	opacity: 0.6;
	margin-top: 1.5rem;
	letter-spacing: 0.2em;
	animation: pulse 3s infinite;
	font-family: sans-serif;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;

	.icon {
		font-size: 1em;
		position: relative;
		top: -1px;
	}
}

/* 底部 UI */
.ui-bottom {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	padding: 1rem;

	.data-block {
		display: flex;
		gap: 1rem;
		font-size: 0.8rem;
		opacity: 0.8;
	}
}

.exit-btn {
	pointer-events: auto; // 允许点击
	background: transparent;
	border: 1px solid rgba($nana-yellow, 0.3);
	color: rgba($nana-yellow, 0.8);
	padding: 6px 12px;
	font-family: inherit;
	cursor: pointer;
	transition: all 0.3s;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 2px;

	.en {
		font-size: 0.7rem;
		text-transform: uppercase;
		font-weight: bold;
	}

	.cn {
		font-size: 0.6rem;
		opacity: 0.7;
		font-family: sans-serif;
	}

	&:hover {
		background: rgba($nana-yellow, 0.1);
		color: $nana-yellow;
		border-color: $nana-yellow;

		.cn {
			opacity: 1;
		}
	}
}

/* 装饰物 */
.floating-props {
	position: absolute;
	inset: 0;
	overflow: hidden;
	pointer-events: none;
}

.floating-element {
	position: absolute;
	font-size: 2rem;
	opacity: 0.3;
	filter: blur(1px);

	&.banana-shape {
		top: 20%;
		left: 15%;
		font-size: 3rem;
	}

	&.star-shape {
		bottom: 30%;
		right: 20%;
	}

	&.sm {
		top: 60%;
		left: 70%;
		font-size: 1rem;
	}
}

/* 快门动画层 */
.shutter {
	position: absolute;
	left: 0;
	width: 100%;
	height: 0%;
	background: #000;
	z-index: 100;
	pointer-events: none;
}

.shutter-top {
	top: 0;
	border-bottom: 1px solid #222;
}

.shutter-bottom {
	bottom: 0;
	border-top: 1px solid #222;
}

/* Vue Transition */
.fade-enter-active,
.fade-leave-active {
	transition:
		opacity 0.5s ease,
		transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(5px);
}

/* Keyframes */
@keyframes blink {
	0%,
	100% {
		opacity: 1;
	}

	50% {
		opacity: 0.3;
	}
}

@keyframes pulse {
	0%,
	100% {
		opacity: 0.6;
	}

	50% {
		opacity: 0.2;
	}
}
</style>
