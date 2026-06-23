"use client";

import type { z } from "zod";
import { Form, FormButton, FormGrid } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";
import { useForm } from "@/hooks/use-form";
import {
  type DreamInput,
  dreamCategories,
  dreamPriorities,
  dreamSchema,
  dreamStatuses,
} from "@/lib/validations/dream";

const options = (values: readonly string[]) =>
  values.map((value) => ({ label: value, value }));

export function DreamForm({
  initialData,
  mode = "create",
  onSubmit,
}: {
  initialData?: Partial<DreamInput>;
  mode?: "create" | "edit";
  onSubmit: (data: DreamInput) => void | Promise<void>;
}) {
  const form = useForm<z.infer<typeof dreamSchema>>({
    defaultValues: {
      category: initialData?.category ?? "Professional",
      description: initialData?.description ?? "",
      priority: initialData?.priority ?? "Medium",
      status: initialData?.status ?? "Draft",
      title: initialData?.title ?? "",
    },
    schema: dreamSchema,
  });

  return (
    <Form
      className="rounded-lg border bg-card p-5"
      form={form}
      onSubmit={onSubmit}
    >
      <FormGrid>
        <FormInput<z.infer<typeof dreamSchema>> label="Title" name="title" />
        <FormSelect<z.infer<typeof dreamSchema>>
          label="Category"
          name="category"
          options={options(dreamCategories)}
        />
        <FormSelect<z.infer<typeof dreamSchema>>
          label="Priority"
          name="priority"
          options={options(dreamPriorities)}
        />
        <FormSelect<z.infer<typeof dreamSchema>>
          label="Status"
          name="status"
          options={options(dreamStatuses)}
        />
      </FormGrid>
      <FormTextarea<z.infer<typeof dreamSchema>>
        label="Description"
        maxLength={2000}
        name="description"
      />
      <FormButton>
        {mode === "create" ? "Create dream" : "Save dream"}
      </FormButton>
    </Form>
  );
}
