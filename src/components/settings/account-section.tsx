"use client";

import { z } from "zod";
import { Form, FormButton, FormGrid } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { useForm } from "@/hooks/use-form";
import { toast } from "@/hooks/use-toast";

const passwordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});
type PasswordValues = z.infer<typeof passwordSchema>;

export function AccountSection() {
  const form = useForm<PasswordValues>({
    defaultValues: { currentPassword: "", newPassword: "" },
    schema: passwordSchema,
  });

  return (
    <section className="rounded-lg border bg-card p-5">
      <h2 className="font-semibold">Account settings</h2>
      <Form
        className="mt-4"
        form={form}
        onSubmit={() => {
          toast({ title: "Password validation passed", variant: "success" });
          form.resetForm();
        }}
      >
        <FormGrid>
          <FormInput<PasswordValues>
            label="Current password"
            name="currentPassword"
            type="password"
          />
          <FormInput<PasswordValues>
            label="New password"
            name="newPassword"
            type="password"
          />
        </FormGrid>
        <FormButton>Validate password change</FormButton>
      </Form>
    </section>
  );
}
