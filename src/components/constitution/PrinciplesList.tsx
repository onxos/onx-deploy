"use client";
import { useState } from "react";
import { principles } from "@/lib/constitution/principles";
export default function PrinciplesList() {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      {principles.map((p) => (
        <div
          key={p.id}
          className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <button
            type="button"
            onClick={() => setOpenId(openId === p.id ? null : p.id)}
            className="w-full px-5 py-4 text-left flex items-start gap-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl font-bold text-[#c9a84c] shrink-0">
              {p.number}
            </span>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1e2d3d]">{p.title}</h3>
              {openId !== p.id && (
                <p className="text-sm text-[#5a6c7d] mt-1 line-clamp-1">
                  {p.description}
                </p>
              )}
            </div>
          </button>
          {openId === p.id && (
            <div className="px-5 pb-4 pl-16">
              <p className="text-[#2c3e50] mb-3">{p.description}</p>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-semibold text-[#5a6c7d]">
                    Enforced in:
                  </span>{" "}
                  {p.enforcedIn.join(", ")}
                </p>
                <p>
                  <span className="font-semibold text-[#5a6c7d]">
                    Related SBPs:
                  </span>{" "}
                  {p.relatedSbps.join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
