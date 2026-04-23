"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import GlassTopNav from "./navbar/GlassTopNav";

/** Offset for `fixed` #global-nav (py-4 + h-10 row = 4.5rem). */
const NAV_SPACER_H = "h-[4.5rem]";

export default function Navbar() {
  const pathname = usePathname() ?? "";
  const { user } = useAuth();

  return (
    <>
      <Suspense
        fallback={
          <nav
            className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-black/95 px-4 py-4 sm:px-6"
            aria-busy="true"
            aria-label="Loading navigation"
          >
            <div className="mx-auto h-[52px] max-w-[1440px]" />
          </nav>
        }
      >
        <GlassTopNav
          pathname={pathname}
          profileHref={user ? "/account" : "/login"}
          userName={user?.name}
        />
      </Suspense>
      <div className={NAV_SPACER_H} aria-hidden />
    </>
  );
}
