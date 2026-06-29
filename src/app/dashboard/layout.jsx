import TicketsProvider from '@/components/tickets/TicketsProvider';
import { ToastProvider } from '@/components/ui/Toast';
import Sidebar from '@/components/layout/Sidebar';

export const metadata = {
  title: 'Dashboard',
};

export default function DashboardLayout({ children }) {
  return (
    <ToastProvider>
      <TicketsProvider>
        <div className="dashboard-shell flex min-h-screen">
          <Sidebar />
          <main className="min-w-0 flex-1 p-8 max-md:p-4 max-md:pb-24">{children}</main>
        </div>
      </TicketsProvider>
    </ToastProvider>
  );
}
