export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
      return new Response("Missing 'url' query parameter", { status: 400 });
    }

    try {
      const response = await fetch(targetUrl, {
        headers: {
          "Referer": "https://mangapill.com/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (!response.ok) {
        return new Response(`Failed to fetch image: ${response.statusText}`, { status: response.status });
      }

      const newHeaders = new Headers(response.headers);
      newHeaders.set("Cache-Control", "public, max-age=86400");
      newHeaders.set("Access-Control-Allow-Origin", "*");

      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    } catch (error) {
      console.error("Proxy error:", error);
      return new Response("Internal Server Error during proxying", { status: 500 });
    }
  },
};
