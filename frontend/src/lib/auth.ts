import { api } from "@/lib/api";
import { useAuthStore } from "@/hooks/useAuth";
import type { AuthUser } from "@/types/auth";

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data } = await api.get<AuthUser>("/auth/me");
    useAuthStore.getState().setUser(data);
    return data;
  } catch {
    useAuthStore.getState().clearUser();
    return null;
  }
}

export async function login(credentials: {
  email: string;
  password: string;
}): Promise<void> {
  await api.post("/auth/login", credentials);
  await fetchCurrentUser();
}

export async function register(payload: {
  fullName: string;
  email: string;
  password: string;
}): Promise<void> {
  await api.post("/auth/register", payload);
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
  useAuthStore.getState().clearUser();
}
