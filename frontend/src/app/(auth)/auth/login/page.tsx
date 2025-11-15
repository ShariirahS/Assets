"use client";

import Link from "next/link";
import { AuthForm } from "@/components/forms/AuthForm";
import { login } from "@/lib/auth";
import { Card } from "@heroui/react";
import { useRouter } from "next/navigation";

type LoginFormValues = {
  email: string;
  password: string;
};

const loginFields: Array<{
  name: keyof LoginFormValues & string;
  label: string;
  type?: string;
}> = [
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
];

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 md:flex-row">
      <div className="glass-panel flex flex-1 flex-col gap-4 p-8">
        <h2 className="text-3xl font-semibold">Welcome back</h2>
        <p className="text-default-400">
          Sign in to manage tickets, approve payouts, and monitor wallets in real time.
        </p>
        <ul className="list-disc space-y-2 pl-6 text-sm text-default-400">
          <li>Track lending lifecycle with smart alerts.</li>
          <li>Automate wallet top-ups and settlements.</li>
          <li>Access admin and analyst dashboards instantly.</li>
        </ul>
      </div>
      <Card className="flex-1 border border-default-200 bg-background/80 p-6">
        <AuthForm<LoginFormValues>
          title="Sign in"
          submitLabel="Login"
          fields={loginFields}
          footer={
            <>
              New here?
              <Link className="ml-1 text-primary" href="/auth/register">
                Create an account
              </Link>
            </>
          }
          onSubmit={login}
          onSuccess={() => router.replace("/dashboard")}
        />
      </Card>
    </div>
  );
}
