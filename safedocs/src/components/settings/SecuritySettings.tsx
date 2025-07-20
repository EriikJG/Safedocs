import { Shield, Key, Smartphone, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface SecuritySettings {
  twoFactorEnabled: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  autoLogout: string
  encryptionLevel: string
}

interface SecuritySettingsProps {
  security: SecuritySettings
  onSecurityChange: (key: string, value: any) => void
}

export function SecuritySettings({ security, onSecurityChange }: SecuritySettingsProps) {
  return (
    <>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Autenticación de Dos Factores</Label>
            <p className="text-sm text-muted-foreground">
              Protege tu cuenta con un segundo factor de autenticación
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={security.twoFactorEnabled}
              onCheckedChange={(checked) => onSecurityChange('twoFactorEnabled', checked)}
            />
            {security.twoFactorEnabled && <Badge className="bg-green-100 text-green-800">Activo</Badge>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Notificaciones por Email</Label>
              <p className="text-sm text-muted-foreground">Recibe alertas de seguridad por correo</p>
            </div>
            <Switch
              checked={security.emailNotifications}
              onCheckedChange={(checked) => onSecurityChange('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Notificaciones por SMS</Label>
              <p className="text-sm text-muted-foreground">Recibe alertas críticas por mensaje de texto</p>
            </div>
            <Switch
              checked={security.smsNotifications}
              onCheckedChange={(checked) => onSecurityChange('smsNotifications', checked)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Cierre de Sesión Automático</Label>
            <Select
              value={security.autoLogout}
              onValueChange={(value) => onSecurityChange('autoLogout', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="120">2 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Nivel de Encriptación</Label>
            <Select
              value={security.encryptionLevel}
              onValueChange={(value) => onSecurityChange('encryptionLevel', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aes128">AES-128</SelectItem>
                <SelectItem value="aes256">AES-256</SelectItem>
                <SelectItem value="rsa2048">RSA-2048</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Key className="mr-2 h-4 w-4" />
            Cambiar Contraseña
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Smartphone className="mr-2 h-4 w-4" />
            Configurar Autenticador
          </Button>
        </div>
</>
  )
}
