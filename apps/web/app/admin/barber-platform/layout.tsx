import { AdminGuard } from '@kit/admin/components/admin-guard';

function BarberPlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      {children}
    </div>
  );
}

export default AdminGuard(BarberPlatformLayout);