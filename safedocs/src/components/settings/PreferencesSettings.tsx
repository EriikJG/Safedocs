import { Settings, Moon, Sun } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PreferencesProps {
  preferences: {
    theme: string
    language: string
    timezone: string
    dateFormat: string
  }
  onPreferencesChange: (key: string, value: string) => void
}

export function PreferencesSettings({ preferences, onPreferencesChange }: PreferencesProps) {
  return (
<>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Tema</Label>
            <Select
              value={preferences.theme}
              onValueChange={(value) => onPreferencesChange('theme', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Claro
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Oscuro
                  </div>
                </SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Idioma</Label>
            <Select
              value={preferences.language}
              onValueChange={(value) => onPreferencesChange('language', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Zona Horaria</Label>
            <Select
              value={preferences.timezone}
              onValueChange={(value) => onPreferencesChange('timezone', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Mexico_City">Ciudad de México</SelectItem>
                <SelectItem value="America/New_York">Nueva York</SelectItem>
                <SelectItem value="Europe/Madrid">Madrid</SelectItem>
                <SelectItem value="America/Buenos_Aires">Buenos Aires</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Formato de Fecha</Label>
            <Select
              value={preferences.dateFormat}
              onValueChange={(value) => onPreferencesChange('dateFormat', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
</>
  )
}
