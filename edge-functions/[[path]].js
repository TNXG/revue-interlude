// 1. 友链名单
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

export default async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // 逻辑：如果 URL 后缀是静态资源，或者 Accept 头不包含 text/html，就视为静态资源
  // (简单的判断方法：看路径里有没有点，且不是 .html)
  const isStaticAsset = url.pathname.includes('.') && !url.pathname.endsWith('.html');
  
  if (isStaticAsset) {
    // 这里的 fetch 会直接去拿 SSG 的静态文件，不会死循环
    return fetch(request);
  }

  // --- 只有访问页面时，才执行下面的老友检查 ---

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
    // 构造跳转目标
    const targetUrl = new URL(url.pathname + url.search, "https://www.tnxg.moe");
    // 302 跳转
    return Response.redirect(targetUrl.toString(), 302);
  }

  // --- 普通路人访问 ---
  // 这里的 fetch 也是安全的，它会去你的 Pages 存储桶里拿 index.html
  return fetch(request);
}