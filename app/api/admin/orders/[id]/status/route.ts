import { NextResponse } from "next/server";
import { API_URL as BASE_URL } from "@/src/lib/api-public-config";

function upstreamUrl(id: string): string {
  const base = BASE_URL.replace(/\/$/, "");
  return `${base}/admin/orders/${id}/status`;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.toLowerCase().startsWith("bearer ")) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.text();
    const res = await fetch(upstreamUrl(id), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: auth,
      },
      body,
    });
    const text = await res.text();
    let json: unknown = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = { raw: text.slice(0, 500) };
    }
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `Upstream ${res.status}`, body: json },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }
    return NextResponse.json(json);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream unreachable";
    return NextResponse.json({ ok: false, error: `Could not reach API. ${message}.` }, { status: 502 });
  }
}
