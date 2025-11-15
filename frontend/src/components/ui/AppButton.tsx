"use client";

import { Button } from "@heroui/react";
import type { ButtonProps } from "@heroui/react";

export function AppButton(props: ButtonProps) {
  return <Button color="primary" radius="md" {...props} />;
}
