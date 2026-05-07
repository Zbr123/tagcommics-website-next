import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const OVERVIEW_PATH = "/admin/dashboard/overview";

function upstreamOverviewUrl(): string {
  const base = BASE_URL.replace(/\/$/, "");
  return `${base}${OVERVIEW_PATH}`;
}

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.toLowerCase().startsWith("bearer ")) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(upstreamOverviewUrl(), {
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
      { ok: false, error: `Could not reach API. ${message}.` },
      { status: 502 }
    );
  }
}
