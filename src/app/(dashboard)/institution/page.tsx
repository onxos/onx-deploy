"use client";

import { InstitutionStats } from "@/components/institution/institution-stats";
import { MemberDrawer } from "@/components/institution/member-drawer";
import { MemberTable } from "@/components/institution/member-table";
import { RoleDistribution } from "@/components/institution/role-distribution";
import { FilterChips } from "@/components/ui/filter-chips";
import { SearchInput } from "@/components/ui/search-input";
import { useInstitution } from "@/hooks/use-institution";

export default function InstitutionPage() {
  const {
    filteredMembers,
    query,
    roleCounts,
    roleFilter,
    selectedMember,
    setQuery,
    setRoleFilter,
    setSelectedMember,
    stats,
  } = useInstitution();
  const filters = Object.keys(roleCounts).map((role) => ({
    label: role,
    value: role,
  }));
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-3xl font-semibold">Institution Overview</h1>
        <p className="text-muted-foreground">
          Team directory, roles, and activity status.
        </p>
      </div>
      <InstitutionStats stats={stats} />
      <RoleDistribution counts={roleCounts} />
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <SearchInput onChange={setQuery} value={query} />
        <FilterChips
          filters={filters}
          onRemove={(role) => setRoleFilter(roleFilter === role ? "all" : role)}
        />
      </div>
      <MemberTable members={filteredMembers} onSelect={setSelectedMember} />
      <MemberDrawer
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </main>
  );
}
