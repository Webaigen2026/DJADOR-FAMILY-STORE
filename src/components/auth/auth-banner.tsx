import {
  Heart,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

export default function AuthBanner() {
  return (
    <div className="flex h-full min-h-[700px] items-center rounded-[2rem] bg-slate-950 px-12 py-14 text-white">
      <div className="w-full max-w-xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            DJADOR FAMILY STORE
          </p>

          <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-[1.15] tracking-tight">
            Your account makes shopping simpler.
          </h2>

          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
            Sign in or create an account to keep your
            shopping activity organized in one place.
          </p>
        </div>

        <div className="mt-10 border-t border-slate-800">
          <div className="flex gap-4 border-b border-slate-800 py-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5">
              <PackageCheck
                className="h-5 w-5 text-slate-200"
                aria-hidden="true"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Manage your orders
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                View your purchases and follow order
                updates from your account.
              </p>
            </div>
          </div>

          <div className="flex gap-4 border-b border-slate-800 py-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5">
              <Heart
                className="h-5 w-5 text-slate-200"
                aria-hidden="true"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Save your favorites
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Keep products you like in your wishlist
                and return to them anytime.
              </p>
            </div>
          </div>

          <div className="flex gap-4 py-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5">
              <ShieldCheck
                className="h-5 w-5 text-slate-200"
                aria-hidden="true"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Secure account access
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Your account gives you secure access to
                your personal shopping information.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs leading-5 text-slate-500">
          Shop • Save • Manage
        </p>
      </div>
    </div>
  );
}