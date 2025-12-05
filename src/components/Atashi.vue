<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const emit = defineEmits(["ready"]);

const heroRef = ref(null);
const leftRef = ref(null);
const rightRef = ref(null);

// 导出 refs 供父组件使用
defineExpose({
	heroRef,
	leftRef,
	rightRef,
});

onMounted(() => {
	const { $gsap } = useNuxtApp();
	if (!$gsap || !leftRef.value || !rightRef.value)
		return;

	// 初始状态：设置 transformBox 以使平移基于 SVG 元素的坐标
	$gsap.set([leftRef.value, rightRef.value], { transformBox: "fill-box" });
	// 根据屏幕宽度自适应左右之间的初始留白
	const applyResponsiveGap = () => {
		const w = window.innerWidth;
		// 更小的设备缩短留白；单位为 SVG 自身坐标空间的像素位移
		// 你可以按需调整下面的阈值与数值
		const gap = w <= 480 ? 40 : w <= 768 ? 70 : w <= 1024 ? 100 : 140;
		$gsap.set(leftRef.value, { x: -gap });
		$gsap.set(rightRef.value, { x: gap });
		// 布局完成后显示元素，避免初始位置抖动
		$gsap.set([leftRef.value, rightRef.value], { opacity: 1 });
	};

	applyResponsiveGap();
	// 下一帧通知父组件：SVG 初始布局已完成，避免背景提前显示造成抖动
	requestAnimationFrame(() => emit("ready"));

	// 监听窗口尺寸变化，动态更新留白（可选）
	const onResize = () => applyResponsiveGap();
	window.addEventListener("resize", onResize, { passive: true });
	// 卸载时移除监听，避免内存泄漏
	onUnmounted(() => {
		window.removeEventListener("resize", onResize);
	});
});
</script>

<template>
	<section ref="heroRef" class="hero">
		<svg
			id="_图层_2" data-name="图层_2" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1512 592"
			class="watashi"
		>
			<!-- 左侧分组：左侧文字 -->
			<g ref="leftRef" class="left">
				<polygon
					points="0 0 273 89 255 327 150 370 141 552 5 587 78 281 155.2 282.03 171 187 0 157 0 0"
					fill="#ffffff"
				/>
				<polygon
					points="309.2 96.6 292.97 327.11 358.22 322.8 364.84 210.2 444.05 225.84 443.33 276.11 387.69 276.77 385.04 347.64 443.33 345.99 443.33 401.29 339.67 417.85 339.67 511.58 499.97 469.52 499.97 154.56 309.2 96.6"
					fill="#ffffff"
				/>
				<polygon points="540.04 165.49 540.04 240.01 619.53 253.92 619.53 190.99 540.04 165.49" fill="#ffffff" />
				<polygon points="540.04 268.16 540.04 345.32 620.85 336.05 620.85 278.75 540.04 268.16" fill="#ffffff" />
				<polygon
					points="540.04 384.74 540.04 464.55 696.69 424.64 695.04 212.85 656.95 201.92 656.95 364.2 540.04 384.74"
					fill="#ffffff"
				/>
			</g>

			<!-- 右侧分组：右侧文字 -->
			<g ref="rightRef" class="right">
				<polygon
					points="1001.72 156.55 986.48 284.72 1019.93 281.07 1024.57 246.63 1056.7 242.65 1056.7 293.66 1010 297.63 1009.67 357.25 1056.7 357.25 1056.7 406.59 992.45 400.63 992.11 464.55 1174.27 497.67 1174.27 417.52 1098.43 410.57 1098.76 359.23 1156.05 360.56 1156.72 285.71 1099.09 289.68 1098.76 236.03 1168.97 227.09 1169.3 146.94 1099.09 162.51 1098.76 116.8 1057.36 129.72 1057.03 174.1 1034.18 178.74 1037.49 146.61 1001.72 156.55"
					fill="#ffffff"
				/>
				<path
					d="M951.38,369.17l-.99-127.84-60.28,9.6-.33-13.91,64.91-12.25v-50.67l-143.07,39.08v39.08l48.02-8.39v12.25l-43.72,7.73.66,97.7h-10.31l.3,37.87,9.92,1.14.1,29.21,25.17,4.97v-30.8l71.21,9.27v35.44l37.76,7.29v-37.42l17.22,1.66v-50.34l-16.56-.66ZM859.64,364.53l-17.8-.83.41-16.39h17.39v17.22ZM859.64,313.61l-17.8.5v-17.22l17.8-.99v17.72ZM913.13,366.52h-22.93v-18.13h22.93v18.13ZM890.19,311.54v-18.96l22.54-1.65.4,19.54-22.93,1.08Z"
					fill="#ffffff"
				/>
				<path
					d="M1419.13,468.53v-18.55l60.06,5.96v-68.67l-60.06-2.65.44-19.43,69.77,2.21v-79.49l-68.89,2.65-.44-29.59,85.67-4.86-.43-94.06-49.91,5.74.44-34.89,45.04-7.95-.88-94.94-135.57,38.42-.44-23.85-66.68,20.75v22.52l-92.29,26.05v68.89l34.57-5.99-.14,27-29.32,4.14-6.2,294.53,45.69,9.29,10.16-237.13,87.43-6.62v26.6l-15.7.28,1.57-9.22-51.67,2.87-9.71,100.9,18.11.88,1.32,45.48,56.66,6.69-.12,16.33-76.41-9.77-.44,67.56,241.24,51.22v-87.88l-92.87-11.48ZM1348.02,381.78l-27.14-.85,2.02-17.54.1-.84,25.02,1.19v18.03ZM1383.76,180.34l-93.39,15.47v-29.14l93.39-18.12v31.79Z"
					fill="#ffffff"
				/>
			</g>
		</svg>
	</section>
</template>

<style scoped lang="scss">
.hero {
	position: relative;
	width: 100%;
	height: 100%;
	display: grid;
	place-items: center;
	background: transparent; // 透明背景，使用下层 next-section 的红色
	overflow: visible;
}

.watashi {
	width: min(98vw, 1400px);
	height: auto;
	max-height: 88vh;
	overflow: visible;
}

.left,
.right {
	transform-box: fill-box;
	opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
	.left,
	.right {
		transform: none !important;
		opacity: 1 !important;
	}
}
</style>
