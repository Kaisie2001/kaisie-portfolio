"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy `/work` → one-page site anchor */
export default function WorkRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/#work");
  }, [router]);

  return (
    <div className="flex min-h-[30vh] items-center justify-center font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
      …
    </div>
  );
}
