"use client";

import { useMemo, useState } from "react";

export type InstitutionMember = {
  id: string;
  name: string;
  email: string;
  role: "founder" | "admin" | "operator" | "viewer";
  status: "online" | "offline" | "away";
  lastActive: string;
};

const members: InstitutionMember[] = [
  {
    email: "husam@onx.local",
    id: "m1",
    lastActive: "Now",
    name: "Husam",
    role: "founder",
    status: "online",
  },
  {
    email: "kimi@onx.local",
    id: "m2",
    lastActive: "5 minutes ago",
    name: "Kimi",
    role: "admin",
    status: "online",
  },
  {
    email: "atlas@onx.local",
    id: "m3",
    lastActive: "1 hour ago",
    name: "Atlas",
    role: "operator",
    status: "away",
  },
  {
    email: "viewer@onx.local",
    id: "m4",
    lastActive: "Yesterday",
    name: "Viewer",
    role: "viewer",
    status: "offline",
  },
];

export function useInstitution() {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedMember, setSelectedMember] =
    useState<InstitutionMember | null>(null);

  const filteredMembers = useMemo(
    () =>
      members.filter((member) => {
        const matchesQuery = `${member.name} ${member.email}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesRole = roleFilter === "all" || member.role === roleFilter;
        return matchesQuery && matchesRole;
      }),
    [query, roleFilter],
  );

  const roleCounts = useMemo(
    () =>
      members.reduce<Record<string, number>>((counts, member) => {
        counts[member.role] = (counts[member.role] ?? 0) + 1;
        return counts;
      }, {}),
    [],
  );

  return {
    filteredMembers,
    members,
    query,
    roleCounts,
    roleFilter,
    selectedMember,
    setQuery,
    setRoleFilter,
    setSelectedMember,
    stats: {
      activeNow: members.filter((member) => member.status === "online").length,
      roles: Object.keys(roleCounts).length,
      totalMembers: members.length,
    },
  };
}
