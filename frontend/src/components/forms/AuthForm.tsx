"use client";

import { ReactNode } from "react";
import { useForm, type Path } from "react-hook-form";
import { Input, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { AppButton } from "@/components/ui/AppButton";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";

type FieldConfig<TField extends string> = {
  name: TField;
  label: string;
  type?: string;
};

interface AuthFormProps<TValues extends Record<string, string>> {
  title: string;
  onSubmit: (data: TValues) => Promise<void>;
  fields: Array<FieldConfig<keyof TValues & string>>;
  submitLabel?: string;
  footer?: ReactNode;
  onSuccess?: () => void;
}

export function AuthForm<TValues extends Record<string, string>>({
  title,
  onSubmit,
  fields,
  submitLabel = "Continue",
  footer,
  onSuccess,
}: AuthFormProps<TValues>) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TValues>();

  const submitHandler = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
      toast.success(`${title} successful`);
      onSuccess?.();
    } catch (error) {
      let message = "Something went wrong. Please try again.";
      if (isAxiosError(error)) {
        const data = error.response?.data;
        if (typeof data === "string" && data.trim().length > 0) {
          message = data;
        } else if (data && typeof data === "object") {
          const values = Object.values(data as Record<string, unknown>);
          const extracted = values
            .flatMap((value) => (Array.isArray(value) ? value : [value]))
            .filter((value): value is string => typeof value === "string");
          if (extracted.length > 0) {
            message = extracted.join(" ");
          }
        } else if (error.message) {
          message = error.message;
        }
      }
      toast.error(message);
    }
  });

  return (
    <Card className="w-full max-w-md border border-default-200 shadow-lg">
      <CardHeader className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-small text-default-500">
          Access the Assets platform using your credentials.
        </p>
      </CardHeader>
      <CardBody as="form" className="flex flex-col gap-4" onSubmit={submitHandler}>
        {fields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            type={field.type ?? "text"}
            variant="bordered"
            {...register(field.name as Path<TValues>, { required: true })}
          />
        ))}
        <AppButton type="submit" isLoading={isSubmitting} fullWidth>
          {submitLabel}
        </AppButton>
      </CardBody>
      {footer ? <CardFooter className="justify-center text-sm text-default-500">{footer}</CardFooter> : null}
    </Card>
  );
}
