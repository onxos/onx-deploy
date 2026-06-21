const baseUrl = process.env.ONX_BASE_URL ?? "http://localhost:3000";

const expectations = [
  ["/api/health", 200],
  ["/api/metrics", 200],
  ["/login", 200],
  ["/forbidden", 200],
  ["/pulse", 307],
  ["/registry", 307],
  ["/gaps", 307],
] as const;

const failures: string[] = [];

for (const [path, expectedStatus] of expectations) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  if (response.status !== expectedStatus) {
    failures.push(
      `${path}: expected ${expectedStatus}, got ${response.status}`,
    );
  }
}

if (failures.length > 0) {
  console.error("Staging smoke failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Staging smoke passed for ${baseUrl}`);

export {};
