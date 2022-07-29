import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  const mimetypes = {
    'css': 'text/css',
    'js': 'application/javascript',
    'html': 'text/html',
  };
  
  if (pathname == "/upload") {
    return new Response(`Require INFRASTRUCTURE AND FUNDING Key`);
  } else if (pathname.startsWith("/api/")) {
    return new Response(`Require SECRETS AND DATA Key`);
  } else if (pathname.startsWith("/dynamic/pattern.png")) {
    return new Response(`readFile(.png)`, { headers: { 'content-type': 'image/png' } });
  } else if (mimetypes.m = pathname.match(/\.(html|js|css)$/)) {
    const file = await Deno.readFile("."+pathname);

    return new Response(file, {
      headers: {
        "content-type": mimetypes[mimetypes.m[1]] || "application/octet-stream",
      },
    });
  }

  return new Response(
    `<!doctype html>
<html>
<head>
    <title>CDN</title>
    <style type="text/css">/*Embed First paint*/ html { font: 16px Verdana, Roboto, Garamond, serif; box-sizing: border-box; } body { background: radial-gradient(circle at 50% 50%, rgba(47,51,140,0.8), rgba(0,0,0,0.8)), url("data:image/svg+xml,%3Csvg viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); } ol, ul { list-style: none; } body,h1,h2,h3,h4,h5,h6,p,ol,ul { margin: 0; padding: 0; font-weight: normal; } *, *:before, *:after { box-sizing: inherit; }</style>
    <link rel="stylesheet" href="/css/difficulture.css" />
</head>
<body>
  <header>
    <a href="/">CDN</a>
    <nav>
      <a href="/data">Data</a>
      <a href="/login">Login</a>
    </nav>
  </header>
  <main>
    <h1>CDN</h1>
    <form method="post" enctype="multipart/form-data" action="/upload"><input type="file" name="upload-file" /><input type="submit" /></form>
    <h2>Popular files</h2>
    <div>
      Popular: 
    </div>
  </main>
</body>
</html>`,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    },
  );
}

serve(handleRequest);
