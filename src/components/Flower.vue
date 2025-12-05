<script setup lang="ts">
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onBeforeUnmount, onMounted, ref } from "vue";

const flowerRef = ref(null);
const stemRef = ref(null);

onMounted(() => {
	const { $gsap } = useNuxtApp();
	if (!$gsap)
		return;

	// 等待一下确保主滚动容器已设置
	setTimeout(() => {
		if (!flowerRef.value)
			return;

		// 随滚动旋转花朵 - 使用整个文档滚动
		$gsap.to(flowerRef.value, {
			rotation: 360,
			ease: "none",
			scrollTrigger: {
				trigger: document.documentElement,
				start: "top top",
				end: "max",
				scrub: 1,
			},
		});

		// 黄色直线随滚动缩短
		if (stemRef.value) {
			$gsap.fromTo(stemRef.value, {
				height: "calc(100vh - 3rem)",
			}, {
				height: "0vh",
				ease: "none",
				scrollTrigger: {
					trigger: document.documentElement,
					start: "top top",
					end: "max",
					scrub: 1,
				},
			});
		}
	}, 150);
});

onBeforeUnmount(() => {
	if (!import.meta.client)
		return;
	try {
		const triggers = ScrollTrigger?.getAll?.() ?? [];
		triggers.forEach((st) => {
			if (flowerRef.value && st.vars?.trigger === document.documentElement) {
				st.kill();
			}
		});
	} catch (e) {
		console.warn("Failed to cleanup ScrollTrigger instances for Flower component:", e);
	}
});
</script>

<template>
	<div class="flower-wrapper">
		<!-- 黄色直线 -->
		<div ref="stemRef" class="stem-line" />

		<!-- 花朵 -->
		<div ref="flowerRef" class="flower-container">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.181 13.491" class="flower-svg">
				<path
					fill="#000000"
					d="M14.74 5.227a2.161 2.161 0 00-.845-.628 2.643 2.643 0 00-.4-.145 1.654 1.654 0 00-.531-.072.893.893 0 01-.507-.1c-.1 0-.109-.072 0-.157a.216.216 0 000-.085c0-.109.109-.217.169-.338l.072-.157a3.187 3.187 0 00.157-1.207 1.533 1.533 0 000-.41 2.414 2.414 0 00-.592-1.062 2.414 2.414 0 00-1-.664 1.207 1.207 0 00-.4-.121A6.773 6.773 0 009.91 0a2.415 2.415 0 00-1.05.29 1.63 1.63 0 00-.616.531 1.086 1.086 0 01-.169.241 1.051 1.051 0 00-.193.314.217.217 0 01-.193.169l-.085-.109a2.821 2.821 0 00-.109-.314A3.055 3.055 0 006.91.531a3.235 3.235 0 00-.616-.314A3.163 3.163 0 005.28.012a2.137 2.137 0 00-1.123.254 7.426 7.426 0 00-.748.507.628.628 0 00-.121.133 3.91 3.91 0 00-.423.64 3.079 3.079 0 00-.205.7 2.777 2.777 0 000 .893 3.175 3.175 0 00.278.869c.072.157 0 .241-.157.241a4.382 4.382 0 00-.966.109 1.811 1.811 0 00-.567.229c-.157.109-.29.241-.447.338a1.28 1.28 0 00-.41.507 2.6 2.6 0 00-.29.712 1.968 1.968 0 00-.1.519 4.66 4.66 0 00.121.905 3.431 3.431 0 00.205.592 1.425 1.425 0 00.4.567 4.163 4.163 0 01.338.314 1.208 1.208 0 00.435.205l.579.229a1.3 1.3 0 00.229 0 2.571 2.571 0 01.3 0 .169.169 0 01.133.169.857.857 0 010 .254c0 .157-.121.314-.157.471s-.1.314-.1.362v.435a1.533 1.533 0 000 .241 2.008 2.008 0 00.072.254 2 2 0 00.773 1.207c.157.193.4.266.579.423a.731.731 0 00.543.169 3.513 3.513 0 01.374 0h.616a2.5 2.5 0 00.833-.217.979.979 0 00.217-.121l.447-.4a1.69 1.69 0 00.423-.543.326.326 0 01.109-.145.181.181 0 01.3 0 1.727 1.727 0 01.145.254v.121a.266.266 0 01.145.205l.181.133.145.157a.151.151 0 01.133.085 1.014 1.014 0 00.543.326 5.759 5.759 0 00.664.157 3.489 3.489 0 00.712 0 2.04 2.04 0 00.543-.169 2.185 2.185 0 00.688-.4 3.368 3.368 0 00.447-.483 2.269 2.269 0 00.471-1.123 2.716 2.716 0 00-.266-1.449l-.111-.238a.109.109 0 01.072-.169.278.278 0 01.169 0 .821.821 0 00.338 0 .507.507 0 01.193 0 2.077 2.077 0 00.93-.266 3.042 3.042 0 00.833-.724v-.072a4.225 4.225 0 00.362-.942 2.33 2.33 0 00.072-.761 2.475 2.475 0 00-.435-1.449zm-4.165 2.209a2.413 2.413 0 01-.254.712 2.209 2.209 0 01-.519.688l-.121.121a2 2 0 01-.712.519 2.6 2.6 0 01-.905.254 3.1 3.1 0 01-.748 0l-.362-.072A2.849 2.849 0 016 9.223a2.885 2.885 0 01-.905-1.038 3.212 3.212 0 01-.3-1.28 2.909 2.909 0 01.483-1.618 3.718 3.718 0 01.29-.326 2.837 2.837 0 011.05-.748 3.477 3.477 0 01.918-.205 2.113 2.113 0 01.616 0 2.68 2.68 0 01.869.254 3.851 3.851 0 01.688.471 2.559 2.559 0 01.688.869 2.487 2.487 0 01.241 1.062 1.654 1.654 0 01-.1.773z"
				/>
			</svg>
		</div>
	</div>
</template>

<style scoped lang="scss">
.flower-wrapper {
	position: fixed;
	top: 1rem;
	right: 1rem;
	z-index: 1000;
	pointer-events: none;
}

.flower-container {
	width: 40px;
	height: 40px;
	position: relative;
	z-index: 2;
}

.flower-svg {
	width: 100%;
	height: 100%;
}

.stem-line {
	position: absolute;
	top: 2rem; // 花朵中心位置 (1rem + 20px)
	left: 50%;
	transform: translateX(-50%);
	width: 2px;
	background-color: #fdd162;
	transform-origin: top center;
	z-index: 1;
}
</style>
