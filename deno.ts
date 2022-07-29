import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  const mimetypes = {
    'css': 'text/css',
    'js': 'application/javascript',
    'html': 'text/html',
  };
  
  if (pathname == "/upload") {
    return new Response(`Require Key`);
  } else if (mimetypes.m = pathname.match(/\.(html|js|css)$/)) {
    const file = await Deno.readFile("."+pathname);

    return new Response(file, {
      headers: {
        "content-type": mimetypes[mimetypes.m] || "application/octet-stream",
      },
    });
  }

  return new Response(
    `<html>
      <head>
        <link rel="stylesheet" href="/css/custom-2.css" />
        
      </head>
      <body>
        <h1>CDN</h1>
        <form method="post" enctype="multipart/form-data" action="/upload"><input type="file" name="upload-file" /><input type="submit" /></form>
        
        <h2>Popular files</h2>
        <div>
          Popular: 
        </div>
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
