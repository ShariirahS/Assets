"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";

type HealthStatus = "loading" | "ok" | "error";

type HealthResponse = {
  status?: string;
};

export function useBackendHealth(pollIntervalMs = 30000) {
  const [status, setStatus] = useState<HealthStatus>("loading");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = useCallback(async () => {
    setIsChecking(true);
    try {
      const response = await api.get<HealthResponse>("/health", { timeout: 5000 });
      const normalizedStatus = response.data.status?.toLowerCase();
      if (normalizedStatus === "ok") {
        setStatus("ok");
        setError(null);
      } else {
        setStatus("error");
        setError(
          normalizedStatus ? `Unexpected status: ${normalizedStatus}` : "Missing health payload",
        );
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLastChecked(new Date());
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    void checkHealth();
    if (pollIntervalMs <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      void checkHealth();
    }, pollIntervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [checkHealth, pollIntervalMs]);

  const lastCheckedLabel = useMemo(() => {
    if (!lastChecked) {
      return null;
    }
    return lastChecked.toLocaleTimeString();
  }, [lastChecked]);

  return {
    status,
    lastChecked,
    lastCheckedLabel,
    error,
    isChecking,
    refresh: checkHealth,
    isHealthy: status === "ok",
  };
}
