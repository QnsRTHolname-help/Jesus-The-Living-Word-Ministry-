"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

export default function RetreatShare({ title }) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => (typeof window !== "undefined" ? window.location.href : "");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const shareOrCopy = async () => {
    const url = getUrl();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title} — join us.`,
          url
        });
      } catch (err) {
        const aborted = err instanceof Error && err.name === "AbortError";
        if (!aborted) await copyLink();
      }
    } else {
      await copyLink();
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:flex-wrap">
      <button type="button" onClick={shareOrCopy} className="btn-ghost min-h-11 w-full justify-center gap-2 sm:min-h-10 sm:w-auto">
        <Share2 size={17} aria-hidden />
        Share
      </button>
      <button type="button" onClick={copyLink} className="btn-ghost min-h-11 w-full justify-center gap-2 sm:min-h-10 sm:w-auto">
        {copied ? <Check size={17} className="text-emerald-300" aria-hidden /> : <Copy size={17} aria-hidden />}
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
