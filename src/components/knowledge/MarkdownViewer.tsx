"use client";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  documentPath: string;
}
export default function MarkdownViewer({ documentPath }: Props) {
  const [content, setContent] = useState<string>("Loading...");
  useEffect(() => {
    fetch(`/docs/${documentPath}`)
      .then((r) => (r.ok ? r.text() : "Document not found."))
      .then(setContent)
      .catch(() => setContent("Failed to load document."));
  }, [documentPath]);
  return (
    <div className="prose prose-slate max-w-none p-6 bg-white rounded-lg border">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
