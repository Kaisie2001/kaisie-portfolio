"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy `/about` → one-page site anchor */
export default function AboutRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/#about");
  }, [router]);

  return (
    <div className="flex min-h-[30vh] items-center justify-center font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
      …
    </div>
  );
}
