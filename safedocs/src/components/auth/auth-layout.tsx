import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col justify-center md:flex-row md:justify-between md:gap-x-8">
      {/* Sección izquierda: Formulario */}
      <div className="flex flex-1 flex-col gap-4 p-6 md:p-10">
        {/* Header: Logo y selector de idioma */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-medium">
            <Image
            src="/Logo.png"
            width={100}
            height={100}
            alt="Plataforma de gestión segura de documentos personales"
            className="flex h-10 w-10 items-center justify-center rounded-md text-primary-foreground"
          />
            <span className="font-bold">SafeDocs</span>
          </div>
          <Select defaultValue="es">
            <SelectTrigger className="w-[100px]">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span>ES</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">
                <div className="flex items-center gap-2">
                  <span>ES</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Contenedor del formulario */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </div>

        {/* Derechos reservados */}
        <div className="text-center text-sm text-muted-foreground">
          <span>©2024 SafeDocs. Todos los derechos reservados</span>
        </div>
      </div>

      {/* Sección derecha con SVG y texto adaptado */}
      <div className="hidden bg-gradient-to-b from-gray-50 to-white p-10 dark:from-gray-900 dark:to-gray-700 md:basis-1/2 md:p-12 lg:block">
        <div className="flex h-full flex-col items-center justify-center">
          <Image
            src="/2808349.jpg"
            alt="Plataforma de gestión segura de documentos personales"
            width={500}
            height={400}
            className="h-auto w-4/5"
          />

          <div className="mt-6 w-full px-6 text-left">
            <span className="rounded-full bg-gray-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              GESTIÓN DOCUMENTAL SEGURA
            </span>

            <h2 className="mt-2 text-2xl font-bold">Almacena, gestiona y comparte tus documentos de forma segura</h2>

            <p className="mt-2 text-sm">
              Organiza tus documentos personales en un solo lugar con la máxima seguridad. Comparte archivos importantes
              con familiares o colegas de manera controlada, establece permisos específicos y mantén el control total sobre
              quién accede a tu información confidencial en todo momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
