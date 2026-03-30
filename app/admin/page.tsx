import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { requireAdminAuth } from "@/lib/server-auth";

export default async function AdminPage() {
  await requireAdminAuth();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-forest/60">
          Admin control room
        </p>
        <h1 className="font-serif text-4xl text-cedar">
          Review, edit, and moderate events
        </h1>
      </div>
      <AdminDashboard />
    </div>
  );
}

