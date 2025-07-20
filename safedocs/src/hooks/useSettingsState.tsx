import { useState } from "react"

export function useSettingsState() {
  const [profile, setProfile] = useState({
    name: "Usuario Safedocs",
    email: "usuario@safedocs.com",
    phone: "+1 234 567 8900",
    company: "Safedocs Inc",
    bio: "Administrador de documentos seguros",
  })

  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    autoLogout: "30",
    encryptionLevel: "aes256",
  })

  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "es",
    timezone: "America/Mexico_City",
    dateFormat: "dd/mm/yyyy",
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setProfile(prev => ({ ...prev, [id]: value }))
  }

  const handleSecurityChange = (key: string, value: any) => {
    setSecurity(prev => ({ ...prev, [key]: value }))
  }

  const handlePreferencesChange = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  return {
    profile,
    security,
    preferences,
    handleProfileChange,
    handleSecurityChange,
    handlePreferencesChange
  }
}
