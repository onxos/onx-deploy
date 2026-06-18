"use client";

// Session ID persisted for the browser session — never sent to server as PII
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  const key = "onx_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function usePageTracker(page: string) {
  return { sessionId: getSessionId(), page };
}
