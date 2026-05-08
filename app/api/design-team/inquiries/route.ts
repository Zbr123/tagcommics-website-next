import { NextResponse } from "next/server";
import { API_URL as BASE_URL } from "@/src/lib/api-public-config";

/** Path under `/api/v1` or absolute URL for admin list endpoint. */
const INQUIRIES_PATH = process.env.DESIGN_TEAM_INQUIRIES_PATH?.trim() || "/design-team/inquiries";

function upstreamInquiriesUrl(): string {
  const p = INQUIRIES_PATH;
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  const base = BASE_URL.replace(/\/$/, "");
  return `${base}${p.startsWith("/") ? p : `/${p}`}`;
}

/** Forwards `?page=&limit=` etc. to the API when the backend paginates. */
function upstreamUrlWithRequestSearch(request: Request): string {
  const base = upstreamInquiriesUrl();
  const search = new URL(request.url).search;
  return `${base}${search}`;
}

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.toLowerCase().startsWith("bearer ")) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(upstreamUrlWithRequestSearch(request), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: auth,
      },
    });
    const text = await res.text();
    let body: unknown = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = { raw: text.slice(0, 500) };
    }
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `Upstream ${res.status}`, body },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }
    return NextResponse.json(body);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream unreachable";
    return NextResponse.json(
      {
        ok: false,
        error: `Could not reach API. ${message}. Implement GET ${INQUIRIES_PATH} with admin auth on the backend.`,
      },
      { status: 502 }
    );
  }
}
