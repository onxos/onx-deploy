"use client";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  documentPath: string;
}
export default function MarkdownViewer({ documentPath }: Props) {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["markdown-document", documentPath],
    queryFn: async ({ signal }) => {
      const response = await fetch(`/docs/${documentPath}`, { signal });
      return response.ok ? response.text() : "Document not found.";
    },
  });

  const content = isError
    ? "Failed to load document."
    : isLoading
      ? "Loading..."
      : (data ?? "");

  return (
    <div className="prose prose-slate max-w-none p-6 bg-white rounded-lg border">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
