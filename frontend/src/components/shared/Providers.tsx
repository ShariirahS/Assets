"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ReactNode, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchCurrentUser } from "@/lib/auth";
import { useAuthStore } from "@/hooks/useAuth";

interface ProvidersProps {
  children: ReactNode;
}

function ThemedToastContainer() {
  const { resolvedTheme } = useTheme();

  return (
    <ToastContainer
      position="bottom-right"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      closeOnClick
      newestOnTop={false}
      draggable
      hideProgressBar
    />
  );
}

export function Providers({ children }: ProvidersProps) {
  const initialized = useAuthStore((state) => state.initialized);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (initialized || hasFetchedRef.current) {
      return;
    }

    hasFetchedRef.current = true;
    void fetchCurrentUser();
  }, [initialized]);

  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
      <HeroUIProvider>
        {children}
        <ThemedToastContainer />
      </HeroUIProvider>
    </NextThemesProvider>
  );
}
