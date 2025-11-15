"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Avatar,
} from "@nextui-org/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useShallow } from "zustand/react/shallow";

import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useAuthStore } from "@/hooks/useAuth";
import { APP_NAME } from "@/lib/config";
import { logout } from "@/lib/auth";

export function AppNavbar() {
  const { user, initialized } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      initialized: state.initialized,
    })),
  );

  const avatarLabel = user
    ? (user.fullName
        ? user.fullName
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("")
        : user.email.slice(0, 2).toUpperCase())
    : "";

  const roleLabel = user?.role === "admin" ? "Admin" : "Member";

  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/wallet", label: "Wallet" },
    { href: "/tickets", label: "Tickets" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <Navbar
      maxWidth="xl"
      position="sticky"
      className="mt-6 rounded-full border border-border/40 bg-surface/70 px-4 py-3 shadow-soft backdrop-blur-2xl"
    >
      <NavbarBrand className="items-center gap-2 font-semibold text-large text-foreground">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-accent/20 text-accent shadow-soft">
          ◈
        </span>
        <Link
          as={NextLink}
          href="/"
          color="foreground"
          className="bg-gradient-to-r from-accent via-accentStrong to-[#8F7BFF] bg-clip-text text-transparent"
        >
          {APP_NAME}
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden gap-3 sm:flex" justify="center">
        {links.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <NavbarItem key={item.href}>
              <Link
                as={NextLink}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  isActive
                    ? "bg-accent/20 text-accent shadow-soft"
                    : "text-muted hover:bg-surfaceMuted/70 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>
      <NavbarContent className="items-center gap-3" justify="end">
        <NavbarItem className="hidden sm:flex">
          <ThemeToggle />
        </NavbarItem>
        {user ? (
          <>
            <NavbarItem className="hidden items-center gap-3 lg:flex">
              <div className="hidden flex-col text-right lg:flex">
                <span className="text-sm font-semibold text-foreground">{user.fullName || user.email}</span>
                <span className="text-[0.65rem] uppercase tracking-[0.32em] text-muted">{roleLabel}</span>
              </div>
              <Avatar
                className="size-11 border border-accent/30 bg-accent/15 text-accent shadow-soft"
                name={avatarLabel}
                showFallback
              />
            </NavbarItem>
            <NavbarItem>
              <Button
                size="sm"
                radius="full"
                className="bg-gradient-to-r from-accent via-accentStrong to-[#8F7BFF] text-white shadow-hero"
                onPress={async () => {
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
          </>
        ) : initialized ? (
          <NavbarItem>
            <Button
              as={NextLink}
              href="/auth/login"
              size="sm"
              radius="full"
              className="bg-gradient-to-r from-accent via-accentStrong to-[#8F7BFF] text-white shadow-hero"
            >
              Sign in
            </Button>
          </NavbarItem>
        ) : null}
      </NavbarContent>
    </Navbar>
  );
}
