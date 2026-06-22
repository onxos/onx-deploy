"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { z } from "zod";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Autocomplete } from "@/components/ui/autocomplete";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { CommandPalette } from "@/components/ui/command-palette";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CopyButton } from "@/components/ui/copy-button";
import { DataTable } from "@/components/ui/data-table";
import { FilterChips } from "@/components/ui/filter-chips";
import { Form, FormButton, FormGrid, FormSection } from "@/components/ui/form";
import { FormCheckbox } from "@/components/ui/form-checkbox";
import { FormInput } from "@/components/ui/form-input";
import { FormRadioGroup } from "@/components/ui/form-radio-group";
import { FormSelect } from "@/components/ui/form-select";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormTextarea } from "@/components/ui/form-textarea";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tag } from "@/components/ui/tag";
import { useDialog } from "@/hooks/use-dialog";
import { useForm } from "@/hooks/use-form";
import { toast } from "@/hooks/use-toast";

type Row = { id: string; name: string; status: "active" | "watch" };
const rows: Row[] = [
  { id: "1", name: "Atlas", status: "active" },
  { id: "2", name: "Kimi", status: "watch" },
  { id: "3", name: "SECH", status: "active" },
];
const columns: ColumnDef<Row>[] = [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        variant={row.original.status === "active" ? "success" : "warning"}
      >
        {row.original.status}
      </StatusBadge>
    ),
  },
];

const schema = z.object({
  active: z.boolean(),
  domain: z.string().min(1),
  mode: z.string().min(1),
  name: z.string().min(2),
  notes: z.string().min(4),
  notify: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

export default function ComponentsPage() {
  const [filters, setFilters] = useState([
    { label: "active", value: "active" },
  ]);
  const [search, setSearch] = useState("");
  const alertDialog = useDialog(false);
  const confirmDialog = useDialog(false);
  const modalDialog = useDialog(false);
  const form = useForm({
    defaultValues: {
      active: true,
      domain: "clinical",
      mode: "draft",
      name: "Train I",
      notes: "Reusable component package",
      notify: true,
    },
    schema,
  });

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold">Train I Component Library</h1>
        <DataTable columns={columns} data={rows} enableRowSelection />
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Form System</h2>
        <Form
          form={form}
          onSubmit={() => {
            toast({ title: "Form submitted", variant: "success" });
          }}
        >
          <FormSection title="Titan record">
            <FormGrid>
              <FormInput<FormValues> label="Name" name="name" />
              <FormSelect<FormValues>
                label="Domain"
                name="domain"
                options={[
                  { label: "Clinical", value: "clinical" },
                  { label: "Operations", value: "ops" },
                ]}
              />
              <FormRadioGroup<FormValues>
                label="Mode"
                name="mode"
                options={[
                  { label: "Draft", value: "draft" },
                  { label: "Live", value: "live" },
                ]}
              />
              <FormTextarea<FormValues> label="Notes" name="notes" />
              <FormCheckbox<FormValues> label="Active" name="active" />
              <FormSwitch<FormValues> label="Notify" name="notify" />
            </FormGrid>
          </FormSection>
          <FormButton loading={form.formState.isSubmitting}>Save</FormButton>
        </Form>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Search and Utilities</h2>
        <SearchInput onChange={setSearch} value={search} />
        <FilterChips
          filters={filters}
          onAdd={() =>
            setFilters((items) => [
              ...items,
              { label: "new", value: String(items.length) },
            ])
          }
          onRemove={(value) =>
            setFilters((items) => items.filter((item) => item.value !== value))
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Autocomplete
            options={rows.map((row) => ({ label: row.name, value: row.id }))}
            onSelect={(option) => toast({ title: `Selected ${option.label}` })}
          />
          <div className="flex items-center gap-3">
            <Tag onRemove={() => undefined}>evidence-ready</Tag>
            <CopyButton text="ONX Train I" />
          </div>
        </div>
        <AvatarGroup
          avatars={[
            { name: "Husam" },
            { name: "Kimi" },
            { name: "Founder" },
            { name: "Atlas" },
            { name: "SECH" },
          ]}
        />
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Dialogs and Toasts</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-md border px-3 py-2 text-sm"
            onClick={alertDialog.openDialog}
            type="button"
          >
            Open alert
          </button>
          <button
            className="rounded-md border px-3 py-2 text-sm"
            onClick={confirmDialog.openDialog}
            type="button"
          >
            Open confirm
          </button>
          <button
            className="rounded-md border px-3 py-2 text-sm"
            onClick={modalDialog.openDialog}
            type="button"
          >
            Open modal
          </button>
          <button
            className="rounded-md border px-3 py-2 text-sm"
            onClick={() =>
              toast({
                description: "Notification system visual evidence.",
                title: "Train I toast",
                variant: "success",
              })
            }
            type="button"
          >
            Show toast
          </button>
        </div>
      </section>
      <AlertDialog
        description="Alert dialog evidence for Train I."
        onOpenChange={alertDialog.setOpen}
        open={alertDialog.open}
        title="Train I alert"
      />
      <ConfirmDialog
        description="Confirm dialog returns a boolean decision."
        onConfirm={() => undefined}
        onOpenChange={confirmDialog.setOpen}
        open={confirmDialog.open}
        title="Train I confirm"
      />
      <ModalDialog
        footer={
          <button
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            onClick={modalDialog.close}
            type="button"
          >
            Close
          </button>
        }
        onOpenChange={modalDialog.setOpen}
        open={modalDialog.open}
        title="Train I modal"
      >
        <p className="text-sm text-muted-foreground">
          Generic modal content renders through the shared modal component.
        </p>
      </ModalDialog>
      <CommandPalette
        commands={[
          {
            label: "Show success toast",
            action: () =>
              toast({ title: "Command executed", variant: "success" }),
          },
        ]}
      />
    </main>
  );
}
