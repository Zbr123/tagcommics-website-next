"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  fetchDesignTeamInquiries,
  type DesignTeamInquiriesPagination,
  type DesignTeamInquiryRow,
} from "@/src/lib/design-team-inquiries-api";
import { useAuth } from "@/src/hooks/use-auth";

function displayName(row: DesignTeamInquiryRow): string {
  const fn = row.firstName ?? row.first_name ?? "";
  const ln = row.lastName ?? row.last_name ?? "";
  const full = `${fn} ${ln}`.trim();
  return full || "—";
}

function displayCompany(row: DesignTeamInquiryRow): string {
  return String(row.companyName ?? row.company_name ?? "—");
}

export default function AdminDesignInquiriesPage() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<DesignTeamInquiryRow[]>([]);
  const [pagination, setPagination] = useState<DesignTeamInquiriesPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const result = await fetchDesignTeamInquiries(token, { page });
    setLoading(false);
    if (result.ok) {
      setRows(result.data);
      setPagination(result.pagination);
    } else {
      setRows([]);
      setPagination(null);
      setError(result.error);
    }
  }, [token, page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Design team inquiries</h1>
        <p className="text-gray-400 max-w-3xl">
          Submissions from the <span className="text-brand">/design-team</span> contact modal. Data loads from your
          API <code className="text-zinc-300">GET /design-team/inquiries</code> (proxied through Next.js). Add that
          endpoint on the backend to see rows here.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-amber-400/30 bg-amber-950/25 px-4 py-3 text-sm text-amber-100">
          <p className="font-bold text-amber-200">Could not load inquiries</p>
          <p className="mt-1 text-amber-100/90">{error}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {pagination && rows.length > 0 ? (
          <p className="text-sm text-gray-400">
            Page <span className="font-semibold text-white">{pagination.page}</span> of{" "}
            <span className="font-semibold text-white">{pagination.totalPages}</span>
            <span className="text-gray-500"> · </span>
            <span className="text-gray-400">{pagination.total} total</span>
          </p>
        ) : (
          <span />
        )}
        <div className="flex flex-wrap items-center justify-end gap-2">
          {pagination && pagination.totalPages > 1 ? (
            <>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={loading || page <= 1}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-bold text-white transition hover:border-brand/40 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={loading || page >= pagination.totalPages}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-bold text-white transition hover:border-brand/40 disabled:opacity-40"
              >
                Next
              </button>
            </>
          ) : null}
          <button
            type="button"
            onClick={load}
            disabled={loading || !token}
            className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:border-brand/40 disabled:opacity-50"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {loading && rows.length === 0 ? (
        <p className="text-gray-400">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-gray-500 border border-white/10 rounded-xl p-8 text-center">
          No inquiries to show yet{page > 1 ? " on this page" : ""}.
        </p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-x-auto rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950"
        >
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {rows.map((row) => (
                <tr key={String(row.id)} className="hover:bg-white/[0.03]">
                  <td className="px-4 py-3 whitespace-nowrap text-gray-400">
                    {row.created_at ?? row.createdAt ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">{displayName(row)}</td>
                  <td className="px-4 py-3">{displayCompany(row)}</td>
                  <td className="px-4 py-3">{row.email ?? "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.phone ?? "—"}</td>
                  <td className="px-4 py-3 max-w-[280px] truncate" title={String(row.message ?? "")}>
                    {row.message ? String(row.message) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
