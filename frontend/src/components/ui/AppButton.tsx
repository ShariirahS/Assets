"use client";

import { Button } from "@nextui-org/react";
import type { ButtonProps } from "@nextui-org/react";

export function AppButton(props: ButtonProps) {
  return <Button color="primary" radius="md" {...props} />;
}
