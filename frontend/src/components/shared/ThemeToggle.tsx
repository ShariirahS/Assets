"use client";

import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { type SVGProps } from "react";

function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2m0 14v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M3 12h2m14 0h2M5.64 18.36l1.42-1.42m9.88-9.88l1.42-1.42" />
    </svg>
  );
}

function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  if (!resolvedTheme) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      radius="full"
      size="sm"
      variant="light"
      onPress={() => setTheme(isDark ? "light" : "dark")}
      className="group flex items-center gap-2 bg-surfaceContrast/60 px-3 py-2 text-foreground shadow-soft backdrop-blur-md transition-all duration-300 ease-soft-bounce hover:-translate-y-0.5 hover:bg-surfaceContrast/80"
    >
      <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accentStrong text-white shadow-soft">
        {isDark ? <MoonIcon className="size-4" /> : <SunIcon className="size-4" />}
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
        {isDark ? "Night" : "Day"}
      </span>
    </Button>
  );
}
