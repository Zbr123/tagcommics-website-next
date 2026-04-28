"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PhoneInput } from "react-international-phone";
import { isValidPhoneNumber } from "libphonenumber-js";

interface ContactFormState {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  message: string;
  acceptPolicy: boolean;
}

const INITIAL_FORM: ContactFormState = {
  firstName: "",
  lastName: "",
  companyName: "",
  email: "",
  phone: "",
  message: "",
  acceptPolicy: false,
};

export default function JoinInitiativeSection() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM);
  const [phoneError, setPhoneError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.phone || !isValidPhoneNumber(form.phone)) {
      setPhoneError("Please enter a valid phone number.");
      return;
    }
    setPhoneError("");
    setIsSubmitted(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsSubmitted(false);
    setForm(INITIAL_FORM);
    setPhoneError("");
  };

  const openModal = () => {
    setIsOpen(true);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.hash !== "#contact-team") {
      window.history.pushState({ modal: "contact-team" }, "", `${url.pathname}${url.search}#contact-team`);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // If user lands on design-team with hash, restore modal state.
    if (window.location.hash === "#contact-team") {
      setIsOpen(true);
    }

    const onPopState = () => {
      // Browser Back should close modal and remain on /design-team.
      if (window.location.hash === "#contact-team") {
        setIsOpen(true);
      } else {
        closeModal();
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  /** Close modal and return user to the design team page (explicit route). */
  const dismissToDesignTeam = () => {
    closeModal();
    if (typeof window !== "undefined" && window.location.hash === "#contact-team") {
      const url = new URL(window.location.href);
      window.history.replaceState({}, "", `${url.pathname}${url.search}`);
    }
    router.replace("/design-team");
  };

  return (
    <>
      <section className="px-6 pb-24 pt-10">
        <div className="mx-auto w-full max-w-full  border-white/10 bg-[#04070b] px-6 py-16 text-center sm:px-10">
          <h2 className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
            Join The <span className="text-[#58E8C1]">Initiative</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400">
            Get early access to new features, behind-the-scenes design content, and exclusive beta invites for comic
            and eBook experiences.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={openModal}
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl border border-white/12 bg-[#0f1318] px-8 text-sm font-bold uppercase tracking-[0.06em] text-white transition hover:border-[#58E8C1]/35 hover:-translate-y-0.5"
            >
              Contact Team
            </button>
            {/* <Link
              href="/new-releases"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#58E8C1]/45 bg-[#58E8C1] px-8 text-sm font-extrabold uppercase tracking-[0.06em] text-[#05100d] shadow-[0_0_24px_rgba(88,232,193,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(88,232,193,0.42)]"
            >
              Join Waitlist
            </Link> */}
          </div>
        </div>
      </section>

      {isOpen ? (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-6">
            <div className="mx-auto my-4 w-full max-w-xl rounded-2xl border border-white/12 bg-[#06090d] shadow-[0_30px_90px_rgba(0,0,0,0.65)] sm:my-8">
              <div className="flex items-center justify-end border-b border-white/8 px-4 py-2.5 sm:px-5">
                <button
                  type="button"
                  onClick={dismissToDesignTeam}
                  aria-label="Close contact form and return to design team"
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 text-lg leading-none text-zinc-300 transition hover:border-[#58E8C1]/45 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="px-5 pb-4 pt-3 sm:px-6 sm:pb-5">
                {!isSubmitted ? (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#58E8C1]">Design Team Contact</p>
                    <h3 className="mt-2 text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
                      Start A New Comic Experience
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                      Share your project goals and our design team will follow up with a tailored plan for your comic or
                      eBook product.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <label className="flex flex-col gap-2 text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                        First Name
                        <input
                          required
                          value={form.firstName}
                          onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                          placeholder="First Name "
                          className="h-11 rounded-xl border border-white/12 bg-black/40 px-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-[#58E8C1]/55 focus:ring-2 focus:ring-[#58E8C1]/25"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                        Last Name
                        <input
                          required
                          value={form.lastName}
                          onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Last Name"
                          className="h-11 rounded-xl border border-white/12 bg-black/40 px-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-[#58E8C1]/55 focus:ring-2 focus:ring-[#58E8C1]/25"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 sm:col-span-2">
                        Company Name
                        <input
                          value={form.companyName}
                          onChange={(e) => setForm((prev) => ({ ...prev, companyName: e.target.value }))}
                          placeholder="Company Name"
                          className="h-11 rounded-xl border border-white/12 bg-black/40 px-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-[#58E8C1]/55 focus:ring-2 focus:ring-[#58E8C1]/25"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 sm:col-span-2">
                        Email
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="Email"
                          className="h-11 w-full rounded-xl border border-white/12 bg-black/40 px-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-[#58E8C1]/55 focus:ring-2 focus:ring-[#58E8C1]/25"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 sm:col-span-2">
                        Phone Number
                        <PhoneInput
                          className="intl-phone-field"
                          defaultCountry="us"
                          value={form.phone}
                          onChange={(phone) => {
                            setForm((prev) => ({ ...prev, phone }));
                            if (phoneError) setPhoneError("");
                          }}
                          inputClassName="!h-11 !w-full !rounded-r-xl !border-y !border-r !border-l-0 !border-white/12 !bg-black/40 !text-sm !font-medium !text-white !outline-none"
                          countrySelectorStyleProps={{
                            buttonClassName:
                              "!h-11 !rounded-l-xl !border-y !border-l !border-white/12 !bg-black/40 !text-white",
                            dropdownStyleProps: {
                              className: "!border-white/12 !bg-[#0b1016] !text-white",
                            },
                          }}
                        />
                        {phoneError ? (
                          <p className="mt-1 text-sm normal-case tracking-normal text-red-400">{phoneError}</p>
                        ) : null}
                      </label>
                      <label className="flex flex-col gap-2 text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 sm:col-span-2">
                        Message
                        <textarea
                          required
                          rows={3}
                          value={form.message}
                          onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                          placeholder="Tell us what we can help you with"
                          className="resize-none rounded-xl border border-white/12 bg-black/40 px-3 py-2.5 text-sm font-medium normal-case tracking-normal text-white outline-none transition placeholder:text-zinc-500 focus:border-[#58E8C1]/55 focus:ring-2 focus:ring-[#58E8C1]/25"
                        />
                      </label>
                      <label className="sm:col-span-2 flex items-start gap-2 text-left text-sm leading-snug text-zinc-300">
                        <input
                          type="checkbox"
                          checked={form.acceptPolicy}
                          onChange={(e) => setForm((prev) => ({ ...prev, acceptPolicy: e.target.checked }))}
                          className="mt-1 h-4 w-4 shrink-0 rounded border-white/25 bg-black/40 text-[#58E8C1] focus:ring-[#58E8C1]"
                        />
                        <span>
                          I&apos;d like to receive more information about company, I understand and agree the{" "}
                          <Link href="" className="text-[#58E8C1] hover:text-cyan-300">
                            Privacy policy
                          </Link>
                        </span>
                      </label>

                      <div className="mt-1 flex flex-wrap gap-2.5 sm:col-span-2">
                        <button
                          type="submit"
                          className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-[#58E8C1]/40 bg-gradient-to-r from-[#58E8C1] to-[#35c5de] px-6 text-sm font-extrabold uppercase tracking-[0.06em] text-[#05100d] transition hover:-translate-y-0.5"
                        >
                          Send Message
                        </button>
                        <button
                          type="button"
                          onClick={dismissToDesignTeam}
                          className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-xl border border-white/12 bg-[#10141a] px-4 text-xs font-bold uppercase tracking-[0.06em] text-zinc-200 transition hover:border-white/25"
                        >
                          Back
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                <div className="py-7 text-center sm:py-9">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#58E8C1]">Request Sent</p>
                    <h3 className="mt-3 text-2xl font-black uppercase text-white sm:text-3xl">Thanks For Reaching Out</h3>
                    <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-zinc-400">
                      Our design team will review your brief and get back to you soon with next steps tailored to your
                      comic and eBook goals.
                    </p>
                    <button
                      type="button"
                      onClick={dismissToDesignTeam}
                      className="mt-7 inline-flex h-11 cursor-pointer items-center justify-center rounded-xl border border-[#58E8C1]/45 bg-[#58E8C1] px-6 text-sm font-extrabold uppercase tracking-[0.06em] text-[#05100d]"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
        </div>
      ) : null}
    </>
  );
}
