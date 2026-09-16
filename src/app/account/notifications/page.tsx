import { redirect } from "next/navigation";
import { Bell } from "lucide-react";

import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";
import NotificationList from "../../../components/notifications/notification-list";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="w-full">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-slate-900" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                Notifications
              </h1>

              {unreadCount > 0 && (
                <span className="rounded-full bg-slate-950 px-2 py-0.5 text-xs font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Stay updated on your orders, account activity, and important
              announcements.
            </p>
          </div>
        </div>
      </div>

      <NotificationList notifications={notifications} />
    </div>
  );
}