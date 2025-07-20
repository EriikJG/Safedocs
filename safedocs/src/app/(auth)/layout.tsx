import { EmailVerificationProvider } from '@/contexts/EmailVerificationContext';
import { ProtectedAuth } from '@/components/ProtectedAuth';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <EmailVerificationProvider>
      <ProtectedAuth>
        {children}
      </ProtectedAuth>
    </EmailVerificationProvider>
  );
}
