// 1. 放在外部，避免每次请求都重新创建数组
const friendSites = [
	"https://blog.utermux.dev",
	"https://blog.wututu.cn",
	"https://chenxi.in",
	"https://innei.in",
	"https://qingfengnb.cn",
	"https://blog.tianli0.top",
	"https://www.594594.xyz",
	"https://www.ilovemath.xyz",
	"https://www.monoko.jp",
	"https://www.imcharon.com",
	"https://blog.xlenco.top",
	"https://www.ssstttar.com",
	"https://www.timochan.cn",
	"https://arthals.ink",
	"https://www.xiaohanwu.com",
	"https://zwh.moe",
	"https://blog.oxysc.cc",
	"https://xxu.do",
	"https://www.matto.top",
	"https://0u0.ren",
	"https://www.saroprock.com",
	"https://blog.zhilu.site",
	"https://blog.ahzoo.cn",
	"https://blog.lkurococ.top",
	"https://blog.yaria.top",
	"https://blog.linux-qitong.top",
	"https://www.gardenwalk.moe",
	"https://www.kindyear.cn",
	"https://note.moxiify.cn",
	"https://caelum.moe",
	"https://blog.ciraos.top",
	"https://blog.redish101.top",
	"https://blog.alayedong.cn",
	"https://yuuu.org",
	"https://blog.lolita.best",
	"https://blog.knlde.top",
	"https://www.ctrlife.cn",
	"https://pinpe.top",
	"https://blog.shenley.cn",
	"https://www.linexic.top",
	"https://sfkm.me",
	"https://nichijou.moe",
	"https://blog.trfox.top",
	"https://ttio.cc",
];

const friendHosts = new Set(friendSites);

export async function onRequest(context) {
    // 关键：从 context 中解构出 env，我们需要它来获取静态资源
    const { request, env } = context;
    const url = new URL(request.url);

    // --- 逻辑：判断是否是老友 ---
    const referer = request.headers.get("Referer");
    const origin = request.headers.get("Origin");

    const isFriend = (urlStr) => {
        if (!urlStr) return false;
        try {
            return friendHosts.has(new URL(urlStr).hostname);
        } catch {
            return false;
        }
    };

    if (isFriend(referer) || isFriend(origin)) {
        // 构建跳转链接：保留原路径和参数
        // 例如：旧站/abc -> 新站/abc
        const targetUrl = new URL(url.pathname + url.search, "https://www.tnxg.moe");
        
        // 302 跳转
        return Response.redirect(targetUrl.toString(), 302);
    }

    // --- 逻辑：不是老友，显示本站内容 ---
    
    // 因为 [[path]].js 拦截了所有请求，我们需要手动去取静态文件
    // env.ASSETS 指向你的构建产物 (index.html, style.css 等)
    // 如果 env.ASSETS 存在，就从那里取；如果不存在(本地调试时)，则尝试 fetch
    if (env && env.ASSETS) {
        return env.ASSETS.fetch(request);
    }
    
    // 兜底
    return fetch(request);
}