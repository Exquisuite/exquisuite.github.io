const cacheName = "eohyeong-iphone-0f890410bbb81ea2";
const shell = ["ai-handoff.js","app.js","assignment.js","dictionary.js","engine.js","index.html","local-context-worker.js","local-context.js","music-player.css","music-player.js","paradigms.json","photo-key-text.js","photo-key.js","photo-match.js","photo.js","reference.js","report.js","spelling.js","study.js","style.css","typing-viewport.js","workspace.css","brand/maplestory-bold.ttf","brand/pretendard-license.txt","brand/pretendard-semibold.woff2","brand/pretendard-thin.woff2","brand/workspace-forest.png","brand/yomi-lavender.gif","brand/yomi.png","iphone.webmanifest","iphone-install.js","iphone-icon-180.png","iphone-icon-192.png","iphone-icon-512.png"];
const scope = new URL(self.registration.scope);
self.addEventListener("install", event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(shell)));
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith("eohyeong-iphone-") && name !== cacheName) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || !url.href.startsWith(scope.href) ||
      request.headers.has("range") || url.pathname.endsWith(".mp3")) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    if (request.mode === "navigate") {
      try { return await fetch(request); }
      catch { return (await cache.match("index.html")) || Response.error(); }
    }
    if (shell.includes(url.pathname.slice(scope.pathname.length))) {
      const bundled = await cache.match(request);
      if (bundled) return bundled;
    }
    try { return await fetch(request); }
    catch { return Response.error(); }
  })());
});
