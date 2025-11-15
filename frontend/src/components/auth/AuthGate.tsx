"use client";

import { ReactNode } from "react";
import { Spinner } from "@heroui/react";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import type { AuthUser } from "@/types/auth";

interface AuthGateProps {
  children: ReactNode;
  roles?: Array<AuthUser["role"]>;
  loadingLabel?: string;
}

export function AuthGate({ children, roles, loadingLabel = "Loading profile..." }: AuthGateProps) {
  const { initialized, isAuthorized } = useRequireAuth({ roles });

  if (!initialized) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner color="primary" label={loadingLabel} labelColor="foreground" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
