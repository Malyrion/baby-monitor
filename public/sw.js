if(!self.define){let e,s={};const n=(n,a)=>(n=new URL(n+".js",a).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,i)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const r=e=>n(e,c),o={module:{uri:c},exports:t,require:r};s[c]=Promise.all(a.map((e=>o[e]||r(e)))).then((e=>(i(...e),t)))}}define(["./workbox-588899ac"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/VE_PivHrMk5eA1SATVsM0/_buildManifest.js",revision:"5257d12be9e82d19d5e4449e5ce89990"},{url:"/_next/static/VE_PivHrMk5eA1SATVsM0/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/455-542b056faf1432d4.js",revision:"542b056faf1432d4"},{url:"/_next/static/chunks/664-1b4479b4462ded63.js",revision:"1b4479b4462ded63"},{url:"/_next/static/chunks/675-8a7bcb32c3fc768b.js",revision:"8a7bcb32c3fc768b"},{url:"/_next/static/chunks/716-39be5767dd43a662.js",revision:"39be5767dd43a662"},{url:"/_next/static/chunks/framework-114634acb84f8baa.js",revision:"114634acb84f8baa"},{url:"/_next/static/chunks/main-299227b7a89856d2.js",revision:"299227b7a89856d2"},{url:"/_next/static/chunks/pages/404-112e53cf29692b9c.js",revision:"112e53cf29692b9c"},{url:"/_next/static/chunks/pages/_app-2c33b488c39f601a.js",revision:"2c33b488c39f601a"},{url:"/_next/static/chunks/pages/_error-8353112a01355ec2.js",revision:"8353112a01355ec2"},{url:"/_next/static/chunks/pages/index-37d8d9217e2f024d.js",revision:"37d8d9217e2f024d"},{url:"/_next/static/chunks/pages/insights-e232522cabb94a26.js",revision:"e232522cabb94a26"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-38cee4c0e358b1a3.js",revision:"38cee4c0e358b1a3"},{url:"/_next/static/css/27057a5f15ae77be.css",revision:"27057a5f15ae77be"},{url:"/_next/static/media/0610ebff456d6cfc.woff2",revision:"8786f06e95694337521729d147b3f669"},{url:"/_next/static/media/21ed5661b47f7f6d.p.woff2",revision:"91c3bc1f55db641843550a62e39f0031"},{url:"/_next/static/media/8a9e72331fecd08b.woff2",revision:"f8a4d4cec8704b696ec245377c0e188e"},{url:"/_next/static/media/bde16c1724335d95.woff2",revision:"c56527d8c69315a82039a810338fd378"},{url:"/_next/static/media/e3b8d441242e07fb.woff2",revision:"8699475078b0c1b86dbe7ad907bb4e81"},{url:"/apple-touch-icon.png",revision:"c14951843752c8e4b77905b66d00b699"},{url:"/favicon-96x96.png",revision:"2514a110cb32300ce592e4d001f93215"},{url:"/favicon.ico",revision:"2055729ab428a29ef9cd7da162531514"},{url:"/favicon.svg",revision:"d59f0aaf29e11f1e8190c558538dffec"},{url:"/manifest.json",revision:"0c96ad6a7916ca05f3bfc7ddb8bc4a47"},{url:"/site.webmanifest",revision:"5ae7cd188cf2586243a85eb3d6bced6b"},{url:"/web-app-manifest-192x192.png",revision:"55cb08dccdf0fa17163c8e9b8c3dbf5a"},{url:"/web-app-manifest-512x512.png",revision:"1a854c198ffe38a91a865a7e63c6d291"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
