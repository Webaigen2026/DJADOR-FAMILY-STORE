"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Check } from "lucide-react";
import { useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  href: string | null;
  isRead: boolean;
  createdAt: Date;
};

export default function NotificationList({
  notifications,
}: {
  notifications: Notification[];
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function markAsRead(id: string) {
    try {
      setLoadingId(id);

      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      router.refresh();
    } catch (error) {
      console.error("Mark notification as read error:", error);
    } finally {
      setLoadingId(null);
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <Bell className="h-7 w-7 text-slate-500" />
        </div>

        <h2 className="text-lg font-semibold text-slate-950">
          No notifications yet
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Updates about your orders and account activity will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200 border-y border-slate-200">
      {notifications.map((notification) => {
        const content = (
          <div className="flex gap-4 py-5">
            <div
              className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                notification.isRead
                  ? "bg-slate-100"
                  : "bg-blue-50"
              }`}
            >
              <Bell
                className={`h-5 w-5 ${
                  notification.isRead
                    ? "text-slate-500"
                    : "text-blue-600"
                }`}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    className={`text-sm text-slate-950 ${
                      notification.isRead
                        ? "font-medium"
                        : "font-semibold"
                    }`}
                  >
                    {notification.title}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                {!notification.isRead && (
                  <button
                    type="button"
                    disabled={loadingId === notification.id}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      void markAsRead(notification.id);
                    }}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {loadingId === notification.id
                      ? "Updating..."
                      : "Mark as read"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );

        if (notification.href) {
          return (
            <Link
              key={notification.id}
              href={notification.href}
              className="block hover:bg-slate-50"
            >
              {content}
            </Link>
          );
        }

        return <div key={notification.id}>{content}</div>;
      })}
    </div>
  );
}