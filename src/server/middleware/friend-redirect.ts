// SSR 中间件：拦截友链访问并重定向
export default defineEventHandler((event) => {
	console.log("[friend-redirect] middleware triggered:", event.node.req.url);

	const url = new URL(event.node.req.url || "", `http://${event.node.req.headers.host}`);

	// 友链名单
	const friendSites = [
		"blog.utermux.dev",
		"blog.wututu.cn",
		"chenxi.in",
		"innei.in",
		"qingfengnb.cn",
		"blog.tianli0.top",
		"www.594594.xyz",
		"www.ilovemath.xyz",
		"www.monoko.jp",
		"www.imcharon.com",
		"blog.xlenco.top",
		"www.ssstttar.com",
		"www.timochan.cn",
		"arthals.ink",
		"www.xiaohanwu.com",
		"zwh.moe",
		"blog.oxysc.cc",
		"xxu.do",
		"www.matto.top",
		"0u0.ren",
		"www.saroprock.com",
		"blog.zhilu.site",
		"blog.ahzoo.cn",
		"blog.lkurococ.top",
		"blog.yaria.top",
		"blog.linux-qitong.top",
		"www.gardenwalk.moe",
		"www.kindyear.cn",
		"note.moxiify.cn",
		"caelum.moe",
		"blog.ciraos.top",
		"blog.redish101.top",
		"blog.alayedong.cn",
		"yuuu.org",
		"blog.lolita.best",
		"blog.knlde.top",
		"www.ctrlife.cn",
		"pinpe.top",
		"blog.shenley.cn",
		"www.linexic.top",
		"sfkm.me",
		"nichijou.moe",
		"blog.trfox.top",
		"ttio.cc",
	];

	const friendHosts = new Set(friendSites);

	// 判断是否为静态资源
	const isStaticAsset = url.pathname.includes(".") && !url.pathname.endsWith(".html");

	// 静态资源直接放行
	if (isStaticAsset) {
		return;
	}

	// 获取 Referer 和 Origin
	const refererHeader = event.node.req.headers.referer || event.node.req.headers.referrer;
	const referer = Array.isArray(refererHeader) ? refererHeader[0] : refererHeader;
	const originHeader = event.node.req.headers.origin;
	const origin = Array.isArray(originHeader) ? originHeader[0] : originHeader;

	// 调试日志：打印所有相关 headers
	console.log("[friend-redirect] headers:", {
		referer,
		origin,
		host: event.node.req.headers.host,
	});

	// 检查是否为友链（支持带或不带 www）
	const isFriend = (urlStr: string | undefined): boolean => {
		if (!urlStr)
			return false;
		try {
			const hostname = new URL(urlStr).hostname;
			const matched = friendHosts.has(hostname) || friendHosts.has(hostname.replace(/^www\./, "")) || friendHosts.has(`www.${hostname}`);
			console.log("[friend-redirect] isFriend check:", { urlStr, hostname, matched });
			return matched;
		} catch (e) {
			console.log("[friend-redirect] isFriend error:", { urlStr, error: e });
			return false;
		}
	};

	console.log("[friend-redirect] 检查结果:", {
		refererIsFriend: isFriend(referer),
		originIsFriend: isFriend(origin),
	});

	// 如果是友链访问，重定向到目标站点
	if (isFriend(referer) || isFriend(origin)) {
		const targetUrl = new URL(url.pathname + url.search, "https://www.tnxg.moe");
		console.log("[friend-redirect] 友链重定向:", {
			from: referer || origin,
			to: targetUrl.toString(),
			userAgent: event.node.req.headers["user-agent"],
			ip: event.node.req.headers["x-forwarded-for"] || event.node.req.socket?.remoteAddress,
		});
		return sendRedirect(event, targetUrl.toString(), 302);
	}

	// 检查是否需要重定向到 www
	const host = event.node.req.headers.host || "";
	if (host && !host.startsWith("www.") && !host.startsWith("localhost")) {
		const wwwUrl = new URL(url.pathname + url.search, `${url.protocol}//www.${host}`);
		console.log("[friend-redirect] www重定向:", {
			from: host,
			to: wwwUrl.toString(),
			userAgent: event.node.req.headers["user-agent"],
			ip: event.node.req.headers["x-forwarded-for"] || event.node.req.socket?.remoteAddress,
		});
		return sendRedirect(event, wwwUrl.toString(), 301);
	}

	// 普通访问，继续处理
});
