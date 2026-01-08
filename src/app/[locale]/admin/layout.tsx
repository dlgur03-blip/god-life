import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';
import AccessDenied from '@/components/admin/AccessDenied';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminMobileNav from '@/components/admin/AdminMobileNav';

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-[#050b14]">
      <AdminSidebar />
      <main className="md:ml-64 pb-20 md:pb-0">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <AdminMobileNav />
    </div>
  );
}
