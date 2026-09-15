import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="w-full">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-slate-900" />

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Stay updated on your orders, account activity, and important
              announcements.
            </p>
          </div>
        </div>
      </div>

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
    </div>
  );
}