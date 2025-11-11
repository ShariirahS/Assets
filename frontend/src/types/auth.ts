export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: "user" | "admin";
}
