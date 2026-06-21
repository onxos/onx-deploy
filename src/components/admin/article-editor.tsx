"use client";

import { useState } from "react";
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

const articleCategories = [
  "approval-archive",
  "ccmr-graph",
  "civilization",
  "constitution",
  "correction-archive",
  "founder",
  "gap",
  "hadeer",
  "pulse",
  "registry",
  "sech",
  "system",
  "va-capabilities",
] as const;

type ArticleCategory = (typeof articleCategories)[number];

type ArticleForm = {
  title: string;
  slug: string;
  category: ArticleCategory;
  content: string;
  documentRef: string;
  importance: "critical" | "standard" | "reference";
};

type ArticlePayload = Omit<ArticleForm, "documentRef"> & {
  documentRef?: string;
};

const emptyForm: ArticleForm = {
  title: "",
  slug: "",
  category: "civilization",
  content: "",
  documentRef: "",
  importance: "standard",
};

function toArticleCategory(category: string): ArticleCategory {
  return articleCategories.includes(category as ArticleCategory)
    ? (category as ArticleCategory)
    : "civilization";
}

function toArticleForm(article?: EditableArticle): ArticleForm {
  if (!article) return { ...emptyForm };

  return {
    title: article.title,
    slug: article.slug,
    category: toArticleCategory(article.category),
    content: article.content,
    documentRef: article.documentRef ?? "",
    importance: (article.importance as ArticleForm["importance"]) ?? "standard",
  };
}

export default function ArticleEditor({
  article,
  onSaved,
}: {
  article?: EditableArticle;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ArticleForm>(() => toArticleForm(article));
  const createArticle = api.civilization.createArticle.useMutation();
  const updateArticle = api.civilization.updateArticle.useMutation();

  const updateField = <Field extends keyof ArticleForm>(
    field: Field,
    value: ArticleForm[Field],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const save = async () => {
    const payload: ArticlePayload = {
      title: form.title,
      slug: form.slug,
      category: form.category,
      content: form.content,
      documentRef: form.documentRef || undefined,
      importance: form.importance,
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
          aria-label="Article title"
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="Title"
          className="rounded border px-3 py-2 text-sm"
        />
        <input
          aria-label="Article slug"
          value={form.slug}
          onChange={(event) => updateField("slug", event.target.value)}
          placeholder="slug"
          className="rounded border px-3 py-2 text-sm"
        />
        <select
          aria-label="Article category"
          value={form.category}
          onChange={(event) =>
            updateField("category", event.target.value as ArticleCategory)
          }
          className="rounded border px-3 py-2 text-sm"
        >
          {articleCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input
            aria-label="Document reference"
            value={form.documentRef}
            onChange={(event) => updateField("documentRef", event.target.value)}
            placeholder="document ref"
            className="rounded border px-3 py-2 text-sm"
          />
          <select
            aria-label="Article importance"
            value={form.importance}
            onChange={(event) =>
              updateField(
                "importance",
                event.target.value as ArticleForm["importance"],
              )
            }
            className="rounded border px-3 py-2 text-sm"
          >
            <option value="critical">critical</option>
            <option value="standard">standard</option>
            <option value="reference">reference</option>
          </select>
        </div>
        <textarea
          aria-label="Article content"
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
