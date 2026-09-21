import Link from "next/link";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-white">
      <div className="mx-auto flex w-full max-w-7xl justify-center px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="w-full max-w-[460px]">
          <div className="mb-8">
            <h1 className="text-[32px] font-semibold tracking-tight text-slate-950">
              {title}
            </h1>

            <p className="mt-2 max-w-md text-[15px] leading-6 text-slate-600">
              {subtitle}
            </p>
          </div>

          <div>{children}</div>

          <div className="mt-9 border-t border-slate-200 pt-6">
            <p className="text-center text-xs leading-5 text-slate-500">
              By continuing, you agree to DJADOR&apos;s{" "}
              <Link
                href="/terms"
                className="font-medium text-slate-700 underline-offset-2 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and acknowledge the{" "}
              <Link
                href="/privacy"
                className="font-medium text-slate-700 underline-offset-2 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <rect
                x="5"
                y="10"
                width="14"
                height="10"
                rx="2"
              />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>

            <span>Secure account access</span>
          </div>
        </div>
      </div>
    </main>
  );
}