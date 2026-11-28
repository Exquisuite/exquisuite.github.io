if ("serviceWorker" in navigator && window.isSecureContext && !window.Capacitor?.isNativePlatform()) {
  addEventListener("load", () => navigator.serviceWorker.register("./iphone-sw.js").catch(error => console.warn(error)));
}
