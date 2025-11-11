"use client";

import { ReactNode } from "react";
import { useForm, type Path } from "react-hook-form";
import { Input, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { AppButton } from "@/components/ui/AppButton";
import { toast } from "react-toastify";

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
}

export function AuthForm<TValues extends Record<string, string>>({
  title,
  onSubmit,
  fields,
  submitLabel = "Continue",
  footer,
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
    } catch {
      toast.error("Something went wrong. Please try again.");
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
