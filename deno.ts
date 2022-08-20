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

    <meta title="CDN" />
    <meta description="An SEO Description for CEOs, still if you are seeing in the search results (rather than seeing the page :), then you know that meta tags of open graph for facebook, etc., are not to be ignored too." />

    <style type="text/css">/* Inline Style for First Paint */ html { opacity: 0; } body { background: radial-gradient(circle at 50% 50%, rgba(47,51,140,0.8), rgba(0,0,0,0.8)); }</style>
    <link rel="stylesheet" href="/css/difficulture-v1.8.22.css" />
</head>
<body>
  <header>
    <a href="/">CDN</a>
    <nav>
      <a href="/data">Data</a>
      <a href="https://data.msheriff.com/auth/ac474a/msh.deno.dev">Login</a>
    </nav>
  </header>
  <main>
    <h1>CDN</h1>
    <form method="post" enctype="multipart/form-data" action="/upload"><input type="file" name="upload-file" /><input type="submit" /></form>
    <h2>Popular files</h2>
    <div>
      Popular: 
    </div>
    <a href="https://data.msheriff.com/">More work here, that you did not see.</a>
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
