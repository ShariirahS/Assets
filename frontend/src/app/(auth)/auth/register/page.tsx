"use client";

import Link from "next/link";
import { AuthForm } from "@/components/forms/AuthForm";
import { register as registerUser } from "@/lib/auth";
import { Card } from "@nextui-org/react";

type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
};

const registerFields: Array<{
  name: keyof RegisterFormValues & string;
  label: string;
  type?: string;
}> = [
  { name: "fullName", label: "Full name" },
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
];

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 md:flex-row">
      <Card className="flex-1 border border-default-200 bg-background/80 p-6">
        <AuthForm<RegisterFormValues>
          title="Create your account"
          submitLabel="Register"
          fields={registerFields}
          footer={
            <>
              Already registered?
              <Link className="ml-1 text-primary" href="/auth/login">
                Sign in
              </Link>
            </>
          }
          onSubmit={registerUser}
        />
      </Card>
      <div className="glass-panel flex flex-1 flex-col gap-4 p-8">
        <h2 className="text-3xl font-semibold">Launch in minutes</h2>
        <p className="text-default-400">
          Spin up the entire Assets experience with prebuilt auth, wallets, tickets, and
          analytics flows.
        </p>
        <ul className="list-disc space-y-2 pl-6 text-sm text-default-400">
          <li>HeroUI components for a polished out-of-the-box UI.</li>
          <li>Reactive dashboards powered by Zustand and Recharts.</li>
          <li>Secure integration with the Django Ninja API shell.</li>
        </ul>
      </div>
    </div>
  );
}
