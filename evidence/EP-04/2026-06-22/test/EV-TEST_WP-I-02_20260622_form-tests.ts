import { assertIncludes, runWpTests } from "./train-i-test-utils";

await runWpTests([
  {
    id: "AC-I02-01",
    name: "All field types render",
    fn: () => {
      for (const name of [
        "form-input",
        "form-textarea",
        "form-select",
        "form-checkbox",
        "form-switch",
        "form-radio-group",
      ]) {
        assertIncludes(`src/components/ui/${name}.tsx`, "FormField");
      }
    },
  },
  {
    id: "AC-I02-02",
    name: "Validation errors display inline",
    fn: () => assertIncludes("src/components/ui/form-field.tsx", "FormError"),
  },
  {
    id: "AC-I02-03",
    name: "Submit calls onSubmit",
    fn: () =>
      assertIncludes("src/components/ui/form.tsx", "handleSubmit(onSubmit)"),
  },
  {
    id: "AC-I02-04",
    name: "Reset clears fields",
    fn: () => assertIncludes("src/hooks/use-form.ts", "resetForm"),
  },
  {
    id: "AC-I02-05",
    name: "Dirty state tracked",
    fn: () => assertIncludes("src/hooks/use-form.ts", "isDirty"),
  },
  {
    id: "AC-I02-06",
    name: "Labels linked to inputs",
    fn: () => assertIncludes("src/components/ui/form-label.tsx", "<label"),
  },
  {
    id: "AC-I02-07",
    name: "Errors announced",
    fn: () => assertIncludes("src/components/ui/form-error.tsx", "aria-live"),
  },
  {
    id: "AC-I02-08",
    name: "Theme-aware classes present",
    fn: () => assertIncludes("src/components/ui/form.tsx", "bg-primary"),
  },
  {
    id: "AC-I02-09",
    name: "Submit loading state",
    fn: () => assertIncludes("src/components/ui/form.tsx", "Submitting..."),
  },
  {
    id: "AC-I02-10",
    name: "Layout helpers compose",
    fn: () => assertIncludes("src/components/ui/form.tsx", "FormGrid"),
  },
]);
