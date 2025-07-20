'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export function LoginForm() {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });
  
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoginError(null); 
    
    try {
      console.log('🔐 LoginForm - Iniciando proceso de login...');
      await signInWithEmail(data.email, data.password);
      console.log('🔐 LoginForm - Login exitoso');
      toast.success('Inicio de sesión exitoso');
      
      // Redirigir al dashboard después del login exitoso
      router.push('/overview');
    } catch (error: any) {
      console.error('🔐 LoginForm - Error al iniciar sesión:', error);
      
      // Mejorar el manejo de errores específicos
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.message) {
        const message = error.message.toLowerCase();
        console.log('🔐 LoginForm - Mensaje de error recibido:', message);
        
        if (message.includes('email o contraseña incorrectos') || 
            message.includes('invalid login credentials') || 
            message.includes('credenciales inválidas') ||
            message.includes('credenciales incorrectas')) {
          errorMessage = 'Email o contraseña incorrectos. Verifica tus credenciales.';
        } else if (message.includes('email not confirmed') || 
                   message.includes('confirma tu email')) {
          errorMessage = 'Por favor confirma tu email antes de iniciar sesión.';
        } else if (message.includes('timeout') || 
                   message.includes('tiempo de espera')) {
          errorMessage = 'Tiempo de espera agotado. Verifica tu conexión a internet.';
        } else if (message.includes('connection') || 
                   message.includes('conexión')) {
          errorMessage = 'No se pudo conectar con el servidor. Intenta más tarde.';
        } else {
          errorMessage = error.message;
        }
      }
      
      console.log('🔐 LoginForm - Mostrando error:', errorMessage);
      setLoginError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Inicia sesión en tu cuenta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-[350px] flex-col gap-y-4 mx-auto">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input placeholder="correo@ejemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Contraseña</FormLabel>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {loginError && (
            <div className="text-sm font-medium text-destructive mt-1">
              {loginError}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Iniciar sesión"
            )}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>
      </Form>

      <div className="relative w-full max-w-[350px] mx-auto">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            O continúa con
          </span>
        </div>
      </div>
      
      <Button
        variant="outline"
        className="w-full max-w-[350px] mx-auto"
        type="button"
        onClick={signInWithGoogle}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="mr-2 w-5 h-5"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.67 1.2 9.16 3.56l6.87-6.87C35.19 2.66 29.95 0 24 0 14.67 0 6.74 5.35 2.6 13.3l7.97 6.18C12.92 13.8 18.02 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.5 24c0-1.51-.13-2.98-.37-4.4H24v8.34h12.7c-.55 2.96-2.2 5.46-4.71 7.15l7.47 5.8C43.86 37.52 46.5 31.34 46.5 24z"
          />
          <path
            fill="#FBBC05"
            d="M10.57 28.48A14.88 14.88 0 019 24c0-1.36.2-2.69.57-3.93L2.6 13.9A23.975 23.975 0 000 24c0 3.8.91 7.39 2.6 10.6l7.97-6.12z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.92-2.15 15.89-5.85l-7.47-5.8c-2.08 1.4-4.74 2.23-8.42 2.23-5.98 0-11.08-4.3-12.93-10.09l-7.97 6.18C6.74 42.65 14.67 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
        Continuar con Google
      </Button>
    </div>
  );
}
