"use client";

import { useMemo, useState } from "react";
import ArticleEditor from "@/components/admin/article-editor";
import { api } from "@/trpc/react";

export default function AdminCivilizationPage() {
  const [category, setCategory] = useState("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const { data: articles, refetch } = api.civilization.listArticles.useQuery({
    limit: 100,
  });

  const categories = useMemo(
    () =>
      Array.from(new Set((articles ?? []).map((article) => article.category))),
    [articles],
  );
  const filteredArticles =
    category === "all"
      ? (articles ?? [])
      : (articles ?? []).filter((article) => article.category === category);
  const editingArticle =
    articles?.find((article) => article.id === editingId) ?? undefined;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1e2d3d]">
            Civilization Content
          </h2>
          <p className="mt-1 text-sm text-[#5a6c7d]">
            Create and maintain Knowledge Center articles stored in the
            database.
          </p>
        </div>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded border px-3 py-2 text-sm text-[#1e2d3d]"
        >
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <ArticleEditor
        article={editingArticle}
        onSaved={() => {
          setEditingId(null);
          void refetch();
        }}
      />

      <div className="overflow-hidden rounded border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1e2d3d] text-white">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Importance</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article) => (
              <tr key={article.id} className="border-t">
                <td className="px-4 py-3 font-medium text-[#1e2d3d]">
                  {article.title}
                </td>
                <td className="px-4 py-3 text-[#5a6c7d]">{article.category}</td>
                <td className="px-4 py-3 text-[#5a6c7d]">
                  {article.importance}
                </td>
                <td className="px-4 py-3 text-[#5a6c7d]">
                  {article.viewCount ?? 0}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setEditingId(article.id)}
                    className="rounded bg-[#c9a84c] px-3 py-1.5 text-xs font-semibold text-[#1e2d3d]"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
