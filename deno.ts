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
    <link rel="stylesheet" href="/css/custom-2.css" />
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
