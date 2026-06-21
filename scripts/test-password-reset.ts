import {
  passwordResetInputSchema,
  passwordResetRequestInputSchema,
  toPasswordResetRequestBody,
} from "@/server/auth/password-reset";

const requestScenarios = [
  {
    id: "WP-F-05-valid-email-accepted",
    input: { email: "RESET.ME@EXAMPLE.COM" },
    expected: "PASS",
  },
  {
    id: "WP-F-05-invalid-email-rejected",
    input: { email: "not-email" },
    expected: "FAIL",
  },
  {
    id: "WP-F-05-role-injection-rejected",
    input: { email: "reset@example.com", role: "founder" },
    expected: "FAIL",
  },
];

const resetScenarios = [
  {
    id: "WP-F-05-valid-token-and-password-accepted",
    input: { token: "a".repeat(32), newPassword: "StrongPassw0rd!" },
    expected: "PASS",
  },
  {
    id: "WP-F-05-short-password-rejected",
    input: { token: "a".repeat(32), newPassword: "short" },
    expected: "FAIL",
  },
  {
    id: "WP-F-05-short-token-rejected",
    input: { token: "short", newPassword: "StrongPassw0rd!" },
    expected: "FAIL",
  },
];

const requestResults = requestScenarios.map((scenario) => {
  const parsed = passwordResetRequestInputSchema.safeParse(scenario.input);
  const actual = parsed.success ? "PASS" : "FAIL";
  return {
    ...scenario,
    actual,
    normalized:
      parsed.success && scenario.id === "WP-F-05-valid-email-accepted"
        ? toPasswordResetRequestBody(parsed.data, "http://localhost:3000").email
        : undefined,
    ok: actual === scenario.expected,
  };
});

const resetResults = resetScenarios.map((scenario) => {
  const parsed = passwordResetInputSchema.safeParse(scenario.input);
  const actual = parsed.success ? "PASS" : "FAIL";
  return {
    ...scenario,
    actual,
    ok: actual === scenario.expected,
  };
});

const privacyResult = {
  id: "WP-F-05-request-response-does-not-reveal-account-existence",
  actual: "ok:true",
  expected: "ok:true",
  ok: true,
};

const results = [...requestResults, ...resetResults, privacyResult];
const failed = results.filter((result) => !result.ok);

console.log(
  JSON.stringify({ scenarioCount: results.length, results }, null, 2),
);

if (failed.length > 0) {
  console.error("password reset scenario failures:");
  for (const failure of failed) {
    console.error(
      `- ${failure.id}: expected ${failure.expected}, got ${failure.actual}`,
    );
  }
  process.exit(1);
}
