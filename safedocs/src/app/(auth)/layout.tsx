import { ProtectedAuth } from "@/components/ProtectedAuth"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedAuth>
      {children}
    </ProtectedAuth>
  )
}
