/** Public design-team contact payload (matches modal form). */

export interface DesignTeamContactPayload {
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone: string;
  message: string;
  acceptPolicy: boolean;
}

export type SubmitDesignTeamContactResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Submits the contact form via the Next.js proxy route (server forwards to your backend).
 */
export async function submitDesignTeamContact(
  payload: DesignTeamContactPayload
): Promise<SubmitDesignTeamContactResult> {
  try {
    const res = await fetch("/api/design-team/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!res.ok) {
      return { ok: false, error: data.error || `Request failed (${res.status})` };
    }
    if (data.ok === false) {
      return { ok: false, error: data.error || "Submission failed" };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}
