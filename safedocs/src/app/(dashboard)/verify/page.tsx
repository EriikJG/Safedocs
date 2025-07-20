"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { DashboardTitle } from "@/components/Sliderbar/DashboardTitle"
import Loading from "@/components/ui/Loading"
import { useVerification } from "@/hooks/useVerification"
import { VerificationControls } from "@/components/verify/VerificationControls"
import { VerificationResultsSummary } from "@/components/verify/VerificationResultsSummary"
import { VerificationResultCard } from "@/components/verify/VerificationResultCard"
import { EmptyDocumentsCard } from "@/components/verify/EmptyDocumentsCard"
import { SecurityNotice } from "@/components/verify/SecurityNotice"

export default function VerifyPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  const {
    verifying,
    verificationProgress,
    results,
    loadingData,
    lastVerification,
    handleVerification,
    formatTimeAgo
  } = useVerification(user)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return null
  }

  if (loadingData) return <Loading title="Verificar Documentos" />

  return (
    <>
      <DashboardTitle>Verificar Documentos</DashboardTitle>

      <div className="flex-1 space-y-6 p-6">
        <VerificationControls
          lastVerification={lastVerification}
          verifying={verifying}
          verificationProgress={verificationProgress}
          resultsCount={results.length}
          formatTimeAgo={formatTimeAgo}
          onVerify={handleVerification}
        />

        {results.length > 0 ? (
          <div className="space-y-4">
            <VerificationResultsSummary results={results} />

            <div className="grid gap-4">
              {results.map((result) => (
                <VerificationResultCard key={result.id} result={result} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyDocumentsCard />
        )}

        <SecurityNotice />
      </div>
    </>
  )
}