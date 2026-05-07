export interface DesignTeamInquiryRow {
  id: string;
  created_at?: string;
  createdAt?: string;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  company_name?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  message?: string;
  [key: string]: unknown;
}

/** Matches backend `data.pagination` on GET /design-team/inquiries. */
export interface DesignTeamInquiriesPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type FetchDesignTeamInquiriesResult =
  | { ok: true; data: DesignTeamInquiryRow[]; pagination: DesignTeamInquiriesPagination | null }
  | { ok: false; error: string };

function asRecord(v: unknown): Record<string, unknown> | null {
  if (v != null && typeof v === "object" && !Array.isArray(v)) {
    return v as Record<string, unknown>;
  }
  return null;
}

/**
 * Backend returns `{ message, data: { inquiries: [...], pagination } }`.
 * Also supports legacy flat shapes (array at `data`, or root `inquiries` / `results` / `items`).
 */
function normalizeList(body: Record<string, unknown>): DesignTeamInquiryRow[] {
  const rootData = body.data;
  let candidates: unknown;

  if (Array.isArray(rootData)) {
    candidates = rootData;
  } else {
    const dataObj = asRecord(rootData);
    if (dataObj) {
      candidates = dataObj.inquiries ?? dataObj.results ?? dataObj.items;
    }
    if (candidates === undefined) {
      candidates = body.inquiries ?? body.results ?? body.items;
    }
  }

  if (Array.isArray(candidates)) {
    return candidates.filter((row): row is DesignTeamInquiryRow => row != null && typeof row === "object");
  }
  return [];
}

function normalizePagination(body: Record<string, unknown>): DesignTeamInquiriesPagination | null {
  const dataObj = asRecord(body.data);
  if (!dataObj) return null;
  const p = asRecord(dataObj.pagination);
  if (!p) return null;
  const total = Number(p.total);
  const page = Number(p.page);
  const limit = Number(p.limit);
  const totalPages = Number(p.totalPages);
  if ([total, page, limit, totalPages].some((n) => Number.isNaN(n))) return null;
  return { total, page, limit, totalPages };
}

export interface FetchDesignTeamInquiriesParams {
  page?: number;
  limit?: number;
}

/**
 * Lists design-team submissions via Next.js proxy (avoids CORS to your API origin).
 * Pass `page` / `limit` when the backend paginates (`?page=&limit=`).
 */
export async function fetchDesignTeamInquiries(
  token: string,
  params?: FetchDesignTeamInquiriesParams
): Promise<FetchDesignTeamInquiriesResult> {
  try {
    const bearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    const sp = new URLSearchParams();
    if (params?.page != null) sp.set("page", String(params.page));
    if (params?.limit != null) sp.set("limit", String(params.limit));
    const qs = sp.toString();
    const url = `/api/design-team/inquiries${qs ? `?${qs}` : ""}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: bearer,
      },
    });
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;

    if (!res.ok) {
      const err =
        typeof body.error === "string"
          ? body.error
          : typeof body.message === "string"
            ? body.message
            : `Failed to load (${res.status})`;
      return { ok: false, error: err };
    }

    const list = normalizeList(body);
    const pagination = normalizePagination(body);
    return { ok: true, data: list, pagination };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Request failed" };
  }
}
