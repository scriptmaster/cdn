import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  // This is how the server works:
  // 1. A request comes in for a specific asset.
  // 2. We read the asset from the file system.
  // 3. We send the asset back to the client.

  if (pathname.match(/\.(html|js|css)$/)) {
    const file = await Deno.readFile("."+pathname);

    return new Response(file, {
      headers: {
        "content-type": "application/octet-stream",
      },
    });
  }

  return new Response(
    `<html>
      <head>
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <h1>CDN</h1>
        <form method="post"><input type="upload" name="upload-file" /><input type="submit" /></form>
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
