"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import LocaleSwitcher from "./LocaleSwitcher";

const Header = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const displayName = session?.user?.name || session?.user?.email || "Profile";
  const initial = (session?.user?.name || session?.user?.email || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="h-20 bg-card  w-full flex justify-between items-center px-20">
      <div className="flex w-full items-center justify-between">
        <Link href={"/"} className="text-primary font-bold text-xl">
          Plant Diseases Detection System
        </Link>
        <div className="flex gap-10 items-center">
          <Link href={"/scan"} className="text-white">
            Scan
          </Link>
          <Link href={"/scan-history"} className="text-white">
            Scan History
          </Link>
          <div className="relative" ref={menuRef}>
            {session ? (
              <>
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted/50 focus:outline-none"
                  onClick={() => setOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={open}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    {initial}
                  </span>
                  <span className="text-sm text-white max-w-[160px] truncate">
                    {displayName}
                  </span>
                </button>
                {open && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-card shadow-lg z-50"
                  >
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted/60"
                      onClick={() => {
                        setOpen(false);
                        signOut({ callbackUrl: "/login" });
                      }}
                    >
                      Sign out
                    </button>
                    <div className="flex w-full ">
                      {session.user.is_admin && (
                        <Link
                          className="w-full text-left px-4 py-2 text-sm hover:bg-muted/60"
                          href={"/admin"}
                        >
                          Admin
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center items-center">
                <Link
                  href="/login"
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted/60"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
          <LocaleSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Header;
