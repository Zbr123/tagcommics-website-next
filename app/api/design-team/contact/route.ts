import { NextResponse } from "next/server";
import { API_URL as BASE_URL } from "@/src/lib/api-public-config";

/** Override full URL or path under `/api/v1` (default: `/design-team/contact`). */
const CONTACT_PATH = process.env.DESIGN_TEAM_CONTACT_PATH?.trim() || "/design-team/contact";

function upstreamContactUrl(): string {
  const p = CONTACT_PATH;
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  const base = BASE_URL.replace(/\/$/, "");
  return `${base}${p.startsWith("/") ? p : `/${p}`}`;
}

/** Backend `{ message, errors?: string[] }` on 400 validation failures. */
function formatUpstreamContactError(body: unknown, status: number): string {
  if (typeof body === "string" && body) {
    return body.slice(0, 400);
  }
  if (body === null || typeof body !== "object") {
    return `Upstream error (${status})`;
  }
  const o = body as { message?: string; errors?: unknown };
  const parts: string[] = [];
  if (typeof o.message === "string" && o.message.trim()) {
    parts.push(o.message.trim());
  }
  if (Array.isArray(o.errors)) {
    const errs = o.errors.filter((e): e is string => typeof e === "string");
    if (errs.length) {
      parts.push(errs.join(" "));
    }
  }
  return parts.length ? parts.join(" — ") : `Upstream error (${status})`;
}

export async function POST(request: Request) {
  let json: Record<string, unknown>;
  try {
    json = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const firstName = String(json.firstName ?? "").trim();
  const lastName = String(json.lastName ?? "").trim();
  const email = String(json.email ?? "").trim();
  const phone = String(json.phone ?? "").trim();
  const message = String(json.message ?? "").trim();
  const companyName = String(json.companyName ?? "").trim();
  const acceptPolicy = Boolean(json.acceptPolicy);

  if (!firstName || !lastName || !email || !phone || !message) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }
  if (!acceptPolicy) {
    return NextResponse.json({ ok: false, error: "You must accept the privacy policy." }, { status: 400 });
  }

  const payload = {
    firstName,
    lastName,
    companyName: companyName || undefined,
    email,
    phone,
    message,
    acceptPolicy: true,
    source: "design-team-contact-modal",
    submittedAt: new Date().toISOString(),
  };

  try {
    const upstream = upstreamContactUrl();
    const res = await fetch(upstream, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.DESIGN_TEAM_CONTACT_SECRET
          ? { "X-Design-Team-Secret": process.env.DESIGN_TEAM_CONTACT_SECRET }
          : {}),
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let body: unknown = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }

    if (!res.ok) {
      const msg = formatUpstreamContactError(body, res.status);
      return NextResponse.json({ ok: false, error: msg }, { status: res.status >= 500 ? 502 : res.status });
    }

    return NextResponse.json({ ok: true, ...(body !== null && typeof body === "object" ? { data: body } : {}) });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream unreachable";
    return NextResponse.json(
      {
        ok: false,
        error: `Could not reach API server. ${message}. Set NEXT_PUBLIC_API_URL and implement POST ${CONTACT_PATH} on the backend.`,
      },
      { status: 502 }
    );
  }
}
