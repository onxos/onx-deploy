export function GET() {
  const memory = process.memoryUsage();
  const body = [
    "# HELP onx_process_heap_used_bytes Process heap used in bytes.",
    "# TYPE onx_process_heap_used_bytes gauge",
    `onx_process_heap_used_bytes ${memory.heapUsed}`,
    "# HELP onx_process_heap_total_bytes Process heap total in bytes.",
    "# TYPE onx_process_heap_total_bytes gauge",
    `onx_process_heap_total_bytes ${memory.heapTotal}`,
    "# HELP onx_staging_readiness Static staging readiness marker.",
    "# TYPE onx_staging_readiness gauge",
    "onx_staging_readiness 1",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; version=0.0.4; charset=utf-8",
    },
  });
}
