"use client";

import type { z } from "zod";
import { Form, FormButton, FormGrid } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";
import { useForm } from "@/hooks/use-form";
import {
  feasibilityRatings,
  type PotentialInput,
  potentialCategories,
  potentialSchema,
} from "@/lib/validations/potential";

const options = (values: readonly string[]) =>
  values.map((value) => ({ label: value, value }));

export function PotentialForm({
  onSubmit,
}: {
  onSubmit: (data: PotentialInput) => void;
}) {
  const form = useForm<z.infer<typeof potentialSchema>>({
    defaultValues: {
      assessmentScore: 50,
      category: "Creation",
      conversionReady: false,
      description: "",
      dreamId: "dream-1",
      feasibility: "Medium",
    },
    schema: potentialSchema,
  });

  return (
    <Form
      className="rounded-lg border bg-card p-5"
      form={form}
      onSubmit={onSubmit}
    >
      <FormGrid>
        <FormInput<z.infer<typeof potentialSchema>>
          label="Parent dream ID"
          name="dreamId"
        />
        <FormInput<z.infer<typeof potentialSchema>>
          label="Assessment score"
          name="assessmentScore"
          type="number"
        />
        <FormSelect<z.infer<typeof potentialSchema>>
          label="Feasibility"
          name="feasibility"
          options={options(feasibilityRatings)}
        />
        <FormSelect<z.infer<typeof potentialSchema>>
          label="Category"
          name="category"
          options={options(potentialCategories)}
        />
      </FormGrid>
      <FormTextarea<z.infer<typeof potentialSchema>>
        label="Description"
        maxLength={2000}
        name="description"
      />
      <FormButton>Create potential</FormButton>
    </Form>
  );
}
