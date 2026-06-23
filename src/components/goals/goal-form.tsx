"use client";

import type { z } from "zod";
import { Form, FormButton, FormGrid } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";
import { useForm } from "@/hooks/use-form";
import { dreamPriorities } from "@/lib/validations/dream";
import {
  type GoalInput,
  goalSchema,
  goalStatuses,
} from "@/lib/validations/goal";

const options = (values: readonly string[]) =>
  values.map((value) => ({ label: value, value }));

export function GoalForm({
  fromPotential,
  onSubmit,
}: {
  fromPotential?: { description: string; title: string };
  onSubmit: (data: GoalInput) => void;
}) {
  const form = useForm<z.infer<typeof goalSchema>>({
    defaultValues: {
      deadline: "2026-06-30",
      description: fromPotential?.description ?? "",
      milestones: [],
      potentialId: fromPotential ? "potential-1" : undefined,
      priority: "High",
      status: "Active",
      title: fromPotential?.title ?? "",
    },
    schema: goalSchema,
  });

  return (
    <Form
      className="rounded-lg border bg-card p-5"
      form={form}
      onSubmit={onSubmit}
    >
      <FormGrid>
        <FormInput<z.infer<typeof goalSchema>> label="Title" name="title" />
        <FormInput<z.infer<typeof goalSchema>>
          label="Deadline"
          name="deadline"
          type="date"
        />
        <FormSelect<z.infer<typeof goalSchema>>
          label="Priority"
          name="priority"
          options={options(dreamPriorities)}
        />
        <FormSelect<z.infer<typeof goalSchema>>
          label="Status"
          name="status"
          options={options(goalStatuses)}
        />
      </FormGrid>
      <FormTextarea<z.infer<typeof goalSchema>>
        label="Description"
        maxLength={2000}
        name="description"
      />
      <FormButton>Create goal</FormButton>
    </Form>
  );
}
