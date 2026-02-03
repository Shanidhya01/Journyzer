import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getBackendApiBase(): string | null {
  // Supported env var names (repo docs use NEXT_PUBLIC_BACKEND_URL; current code used NEXT_PUBLIC_API_URL)
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    process.env.BACKEND_API_URL ||
    null;

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.BACKEND_URL ||
    null;

  const base = apiUrl || backendUrl;
  if (!base) return null;

  const trimmed = base.replace(/\/+$/, "");

  // If the provided base is a plain backend URL, append /api
  if (/\/api$/i.test(trimmed)) return trimmed;
  return `${trimmed}/api`;
}

async function proxy(req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  const backendApiBase = getBackendApiBase();
  if (!backendApiBase) {
    return NextResponse.json(
      {
        message:
          "Backend API URL is not configured. Set NEXT_PUBLIC_API_URL (full .../api) or NEXT_PUBLIC_BACKEND_URL (base URL) in Vercel environment variables.",
      },
      { status: 500 }
    );
  }

  const { path = [] } = await ctx.params;
  const url = new URL(req.url);
  const target = `${backendApiBase}/${path.map(encodeURIComponent).join("/")}${url.search}`;

  const headers = new Headers(req.headers);
  // Prevent issues with compression / hop-by-hop headers.
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");
  // Force identity to avoid gzip/br passthrough issues causing ERR_CONTENT_DECODING_FAILED.
  headers.set("accept-encoding", "identity");

  const method = req.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);

  const upstream = await fetch(target, {
    method,
    headers,
    body: hasBody ? req.body : undefined,
    // Required when streaming a request body in Node fetch.
    // @ts-expect-error - duplex is supported by undici in Node runtime
    duplex: "half",
    redirect: "manual",
  });

  const resHeaders = new Headers(upstream.headers);
  // Avoid returning hop-by-hop headers.
  resHeaders.delete("transfer-encoding");
  resHeaders.delete("connection");
  // The upstream response body returned by fetch may already be decoded.
  // Ensure the browser doesn't try to decode again.
  resHeaders.delete("content-encoding");
  resHeaders.delete("content-length");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: resHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
