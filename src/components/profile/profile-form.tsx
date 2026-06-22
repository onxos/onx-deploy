"use client";

import { z } from "zod";
import { Form, FormButton, FormGrid } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { useForm } from "@/hooks/use-form";
import type { ProfileUser } from "@/hooks/use-profile";

const profileSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm({
  user,
  isSaving,
  onCancel,
  onSave,
}: {
  user: ProfileUser;
  isSaving?: boolean;
  onCancel: () => void;
  onSave: (values: ProfileFormValues) => Promise<void>;
}) {
  const form = useForm<ProfileFormValues>({
    defaultValues: { email: user.email, name: user.name },
    schema: profileSchema,
  });

  return (
    <Form
      className="rounded-lg border bg-card p-6"
      form={form}
      onSubmit={async (values) => {
        await onSave(values);
      }}
    >
      <FormGrid>
        <FormInput<ProfileFormValues> label="Name" name="name" />
        <FormInput<ProfileFormValues> label="Email" name="email" type="email" />
      </FormGrid>
      <div className="flex gap-2">
        <FormButton loading={isSaving}>Save profile</FormButton>
        <button
          className="rounded-md border px-4 py-2 text-sm"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    </Form>
  );
}
