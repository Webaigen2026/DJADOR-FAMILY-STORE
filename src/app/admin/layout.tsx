import { redirect } from "next/navigation";
import { auth } from "../../auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // User is not logged in
  if (!session?.user) {
    redirect("/login");
  }

  // User is logged in but is not an admin
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <>
      <style>{`
        footer {
          display: none !important;
        }
      `}</style>

      {children}
    </>
  );
}