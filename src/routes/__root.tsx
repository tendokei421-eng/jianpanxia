import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "键盘侠模拟器";

const PREVIEW_STAY_SCRIPT = `(function(){var m=location.pathname.match(/^\\/hds-[a-z0-9]+-\\d+-[a-z0-9]+/i);if(!m)return;var prefix=m[0];function fix(url){if(url==null||url==="")return url;try{var u=new URL(String(url),location.href);if(u.origin!==location.origin)return url;if(u.pathname===prefix||u.pathname.indexOf(prefix+"/")===0)return u.pathname+u.search+u.hash;u.pathname=prefix+(u.pathname.charAt(0)==="/"?u.pathname:"/"+u.pathname);return u.pathname+u.search+u.hash;}catch(e){return url;}}var push=history.pushState.bind(history);var replace=history.replaceState.bind(history);history.pushState=function(s,t,url){return push(s,t,fix(url));};history.replaceState=function(s,t,url){return replace(s,t,fix(url));};})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#c8102e" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREVIEW_STAY_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
