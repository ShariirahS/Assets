"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import NextLink from "next/link";
import { APP_NAME } from "@/lib/config";
import { useAuthStore } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";
import { toast } from "react-toastify";

export function AppNavbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <Navbar maxWidth="xl" position="sticky" className="bg-background/60 backdrop-blur">
      <NavbarBrand className="font-semibold text-large">
        <Link as={NextLink} href="/" color="foreground">
          {APP_NAME}
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarItem>
          <Link as={NextLink} href="/dashboard" color="foreground">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link as={NextLink} href="/wallet" color="foreground">
            Wallet
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link as={NextLink} href="/tickets" color="foreground">
            Tickets
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link as={NextLink} href="/admin" color="foreground">
            Admin
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {user ? (
          <NavbarItem>
            <Button
              size="sm"
              variant="flat"
              onClick={async () => {
                try {
                  await logout();
                  toast.info("Signed out");
                } catch {
                  toast.error("Unable to logout. Please retry.");
                }
              }}
            >
              Logout
            </Button>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Button as={NextLink} color="primary" href="/auth/login" size="sm">
              Sign in
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
