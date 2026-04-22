"use client";

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
      <GlassTopNav
        pathname={pathname}
        profileHref={user ? "/account" : "/login"}
        userName={user?.name}
      />
      <div className={NAV_SPACER_H} aria-hidden />
    </>
  );
}
