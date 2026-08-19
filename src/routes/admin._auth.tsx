import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { loadAdminSession } from "@/features/auth/useAdminSession";

export const Route = createFileRoute("/admin/_auth")({
  ssr: false,
  beforeLoad: async () => {
    const { session, isAdmin } = await loadAdminSession();
    if (!session || !isAdmin) {
      throw redirect({ to: "/admin/login" });
    }
    return { adminUserId: session.user.id };
  },
  component: () => <Outlet />,
});
