import { User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfileSettingsProps {
  profile: {
    name: string
    email: string
    phone: string
    company: string
    bio: string
  }
  onProfileChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function ProfileSettings({ profile, onProfileChange }: ProfileSettingsProps) {
  return (
    <>
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/avatars/default-avatar.png" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button variant="outline">Cambiar Foto</Button>
            <p className="text-sm text-muted-foreground">JPG, PNG hasta 2MB</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={onProfileChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={onProfileChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={onProfileChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              value={profile.company}
              onChange={onProfileChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Biografía</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={onProfileChange}
            rows={3}
          />
        </div>
        </>
  )
}
