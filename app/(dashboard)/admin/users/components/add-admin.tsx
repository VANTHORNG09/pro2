"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, X, UserPlus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";

import { useUsers } from "@/lib/hooks/queries/useUsers";
import { useToast } from "@/hooks/use-toast";

export default function AddAdminPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const classId = params.id;

  const { data: users = [], isLoading } = useUsers({ role: "admin" });

  const [search, setSearch] = useState("");
  const [selectedAdminIds, setSelectedAdminIds] = useState<Set<string>>(new Set());

  const filteredAdmins = users.filter((admin) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      admin.fullName.toLowerCase().includes(q) ||
      admin.email.toLowerCase().includes(q)
    );
  });

  const toggleSelectAdmin = (id: string) => {
    setSelectedAdminIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedAdminIds.size === filteredAdmins.length) {
      setSelectedAdminIds(new Set());
    } else {
      setSelectedAdminIds(new Set(filteredAdmins.map((a) => a.id)));
    }
  };

  const handleAddAdmins = () => {
    if (selectedAdminIds.size === 0) {
      toast({
        title: "No admins selected",
        description: "Please select at least one admin to add.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Call API to add admins to class
    toast({
      title: "Admins added",
      description: `${selectedAdminIds.size} admin(s) have been added to this class.`,
    });

    router.push(`/admin/classes/${classId}`);
  };

  return (
    <PageShell>
      <PageHeader
        title="Add Admins to Class"
        description={`Select admins to add to class #${classId}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleAddAdmins} disabled={selectedAdminIds.size === 0}>
              <Save className="mr-2 h-4 w-4" />
              Add Selected ({selectedAdminIds.size})
            </Button>
          </div>
        }
      />

      {/* Search */}
      <SectionCard title="Search Admins">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </SectionCard>

      {/* Admin Selection Table */}
      <SectionCard
        title="Available Admins"
        description={`${filteredAdmins.length} admin(s) available`}
      >
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="border-b border-border/60">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredAdmins.length > 0 &&
                      selectedAdminIds.size === filteredAdmins.length
                    }
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-border"
                  />
                </th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Loading admins...
                  </td>
                </tr>
              ) : filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="border-b border-border/20 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedAdminIds.has(admin.id)}
                        onChange={() => toggleSelectAdmin(admin.id)}
                        className="h-4 w-4 rounded border-border"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {admin.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{admin.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{admin.email}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label="Admin" variant="info" />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={admin.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </PageShell>
  );
}
