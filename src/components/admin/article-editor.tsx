"use client";

import { useEffect, useState } from "react";
import { api } from "@/trpc/react";

type EditableArticle = {
  id: number;
  title: string;
  slug: string;
  category: string;
  content: string;
  documentRef: string | null;
  importance: string | null;
};

type ArticleForm = {
  title: string;
  slug: string;
  category: string;
  content: string;
  documentRef: string;
  importance: "critical" | "standard" | "reference";
};

const emptyForm: ArticleForm = {
  title: "",
  slug: "",
  category: "knowledge",
  content: "",
  documentRef: "",
  importance: "standard",
};

export default function ArticleEditor({
  article,
  onSaved,
}: {
  article?: EditableArticle;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ArticleForm>(emptyForm);
  const createArticle = api.civilization.createArticle.useMutation();
  const updateArticle = api.civilization.updateArticle.useMutation();

  useEffect(() => {
    setForm(
      article
        ? {
            title: article.title,
            slug: article.slug,
            category: article.category,
            content: article.content,
            documentRef: article.documentRef ?? "",
            importance:
              (article.importance as ArticleForm["importance"]) ?? "standard",
          }
        : emptyForm,
    );
  }, [article]);

  const updateField = (field: keyof ArticleForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const save = async () => {
    const payload = {
      ...form,
      documentRef: form.documentRef || undefined,
    };

    if (article) {
      await updateArticle.mutateAsync({ id: article.id, ...payload });
    } else {
      await createArticle.mutateAsync(payload);
      setForm(emptyForm);
    }

    onSaved();
  };

  return (
    <div className="rounded border bg-white p-4">
      <h3 className="font-bold text-[#1e2d3d]">
        {article ? "Edit Article" : "Create Article"}
      </h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <input
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="Title"
          className="rounded border px-3 py-2 text-sm"
        />
        <input
          value={form.slug}
          onChange={(event) => updateField("slug", event.target.value)}
          placeholder="slug"
          className="rounded border px-3 py-2 text-sm"
        />
        <input
          value={form.category}
          onChange={(event) => updateField("category", event.target.value)}
          placeholder="category"
          className="rounded border px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            value={form.documentRef}
            onChange={(event) => updateField("documentRef", event.target.value)}
            placeholder="document ref"
            className="rounded border px-3 py-2 text-sm"
          />
          <select
            value={form.importance}
            onChange={(event) => updateField("importance", event.target.value)}
            className="rounded border px-3 py-2 text-sm"
          >
            <option value="critical">critical</option>
            <option value="standard">standard</option>
            <option value="reference">reference</option>
          </select>
        </div>
        <textarea
          value={form.content}
          onChange={(event) => updateField("content", event.target.value)}
          placeholder="Article content"
          rows={8}
          className="rounded border px-3 py-2 text-sm md:col-span-2"
        />
      </div>
      <button
        type="button"
        onClick={() => void save()}
        disabled={
          createArticle.isPending ||
          updateArticle.isPending ||
          form.title.trim().length < 3 ||
          !form.slug.trim() ||
          !form.content.trim()
        }
        className="mt-4 rounded bg-[#1e2d3d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        Save Article
      </button>
    </div>
  );
}
