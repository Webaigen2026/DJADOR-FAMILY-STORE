import Link from "next/link";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "what-are-cookies", label: "What are cookies?" },
  { id: "necessary", label: "Necessary technologies" },
  { id: "analytics", label: "Analytics technologies" },
  { id: "marketing", label: "Marketing technologies" },
  { id: "preferences", label: "Managing your preferences" },
  { id: "browser", label: "Browser controls" },
  { id: "changes", label: "Changes to this policy" },
  { id: "contact", label: "Contact us" },
];

export default function CookiePolicyPage() {
  return (
    <main className="bg-white text-slate-900">
      {/* Header */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-sm text-slate-500"
          >
            <Link
              href="/"
              className="transition-colors hover:text-slate-950"
            >
              Home
            </Link>

            <span aria-hidden="true">/</span>

            <span className="text-slate-700">
              Cookie Policy
            </span>
          </nav>

          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Privacy &amp; Data
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Cookie Policy
            </h1>

            <p className="mt-5 text-base leading-8 text-slate-600">
              This Cookie Policy explains how DJADOR Family Store
              uses cookies and similar browser technologies, the
              choices available to you, and how you can manage
              optional technologies on this website.
            </p>

            <p className="mt-5 text-sm text-slate-500">
              Last updated: September 17, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)_260px] lg:gap-14">
          {/* Left navigation */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                On this page
              </p>

              <nav
                aria-label="Cookie Policy sections"
                className="mt-5 border-l border-slate-200"
              >
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block border-l-2 border-transparent py-2 pl-4 text-sm leading-5 text-slate-600 transition-colors hover:border-slate-900 hover:text-slate-950"
                  >
                    {section.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Policy */}
          <article className="min-w-0">
            <section
              id="overview"
              className="scroll-mt-28 border-b border-slate-200 pb-10"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Overview
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-600">
                <p>
                  DJADOR Family Store uses browser technologies
                  that support the operation of the website and
                  its shopping features. Some technologies are
                  necessary for the website to function, while
                  optional technologies are controlled through
                  your privacy preferences.
                </p>

                <p>
                  Your choices apply to the browser in which they
                  are saved. You can review or change those choices
                  using Cookie Preferences available in the
                  website footer.
                </p>
              </div>
            </section>

            <section
              id="what-are-cookies"
              className="scroll-mt-28 border-b border-slate-200 py-10"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                What are cookies?
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-600">
                <p>
                  Cookies are small pieces of information that a
                  website can store through your browser. Websites
                  may also use related browser technologies, such
                  as local storage, to remember information or
                  preferences.
                </p>

                <p>
                  In this policy, references to cookies or browser
                  technologies may include these related
                  technologies where appropriate.
                </p>
              </div>
            </section>

            <section
              id="necessary"
              className="scroll-mt-28 border-b border-slate-200 py-10"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Necessary technologies
                </h2>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-700">
                  Always active
                </span>
              </div>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-600">
                <p>
                  Necessary technologies support essential website
                  operations and cannot be disabled through DJADOR
                  Family Store&apos;s Cookie Preferences.
                </p>

                <p>
                  Depending on the feature being used, these
                  technologies may support functions such as
                  authentication, sessions, account security,
                  shopping functionality, and remembering
                  essential website state.
                </p>

                <p>
                  Blocking necessary technologies through your
                  browser may prevent parts of the website from
                  functioning correctly.
                </p>
              </div>
            </section>

            <section
              id="analytics"
              className="scroll-mt-28 border-b border-slate-200 py-10"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Analytics technologies
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-600">
                <p>
                  Analytics is an optional preference category.
                  When analytics technologies are used, they may
                  help us understand how visitors interact with
                  the website and identify opportunities to
                  improve the shopping experience.
                </p>

                <p>
                  Optional analytics technologies should only be
                  activated in accordance with the preference you
                  select through Cookie Preferences.
                </p>
              </div>
            </section>

            <section
              id="marketing"
              className="scroll-mt-28 border-b border-slate-200 py-10"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Marketing technologies
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-600">
                <p>
                  Marketing is also an optional preference
                  category. When marketing technologies are used,
                  they may support activities such as measuring
                  campaigns or providing more relevant
                  advertising.
                </p>

                <p>
                  Optional marketing technologies should only be
                  activated in accordance with the preference you
                  select through Cookie Preferences.
                </p>
              </div>
            </section>

            <section
              id="preferences"
              className="scroll-mt-28 border-b border-slate-200 py-10"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Managing your preferences
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-600">
                <p>
                  When the privacy notice is presented, you can
                  accept optional technologies, reject optional
                  technologies, or choose individual preference
                  categories.
                </p>

                <p>
                  Your selection is saved in your browser so the
                  website can remember your choice. You can change
                  your selection later by choosing{" "}
                  <span className="font-medium text-slate-900">
                    Cookie Preferences
                  </span>{" "}
                  in the footer.
                </p>

                <p>
                  Changing your preference controls future use of
                  optional technologies by DJADOR Family Store.
                  Technologies or information already stored by
                  your browser may also be managed through your
                  browser settings.
                </p>
              </div>
            </section>

            <section
              id="browser"
              className="scroll-mt-28 border-b border-slate-200 py-10"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Browser controls
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-600">
                <p>
                  Most browsers provide settings for viewing,
                  blocking, or deleting cookies and other stored
                  website information.
                </p>

                <p>
                  Browser controls operate separately from DJADOR
                  Family Store&apos;s Cookie Preferences. If you
                  delete the website&apos;s stored preferences,
                  the website may ask you to make your privacy
                  choices again on a future visit.
                </p>
              </div>
            </section>

            <section
              id="changes"
              className="scroll-mt-28 border-b border-slate-200 py-10"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Changes to this Cookie Policy
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-600">
                <p>
                  We may update this Cookie Policy as our website,
                  technologies, or privacy practices change.
                </p>

                <p>
                  When the policy is updated, the date shown at
                  the top of this page may also be updated. Where
                  appropriate, the website may ask you to review
                  your cookie preferences again.
                </p>
              </div>
            </section>

            <section
              id="contact"
              className="scroll-mt-28 pt-10"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Contact us
              </h2>

              <p className="mt-5 text-[15px] leading-7 text-slate-600">
                If you have questions about this Cookie Policy,
                privacy choices, or how DJADOR Family Store uses
                browser technologies, you can contact our customer
                support team.
              </p>

              <Link
                href="/contact"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Contact Support
              </Link>
            </section>
          </article>

          {/* Related information */}
          <aside>
            <div className="border-t border-slate-200 pt-6 lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Related information
              </p>

              <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
                <Link
                  href="/privacy"
                  className="block py-4 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
                >
                  Privacy Policy
                </Link>

                <Link
                  href="/terms"
                  className="block py-4 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
                >
                  Terms of Service
                </Link>

                <Link
                  href="/account/help"
                  className="block py-4 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
                >
                  Help Center
                </Link>

                <Link
                  href="/contact"
                  className="block py-4 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related policies */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Privacy &amp; customer information
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Review related DJADOR Family Store policies and
                customer information.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <Link
                href="/privacy"
                className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
              >
                Terms of Service
              </Link>

              <Link
                href="/refund-policy"
                className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}