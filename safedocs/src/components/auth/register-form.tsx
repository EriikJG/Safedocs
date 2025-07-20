'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TypographyH2 } from '@/components/ui/typography';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { PasswordStrengthIndicator } from './password-strength-indicator';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z
  .object({
    names: z.string().min(1, 'Ingresa tu nombre'),
    last_names: z.string().min(1, 'Ingresa tu apellido'),
    email: z.string().email('Ingresa un correo electrónico válido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
      .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
      .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
      .regex(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      names: '',
      last_names: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Handlers
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const fullName = `${data.names} ${data.last_names}`;
      const result = await signUpWithEmail(data.email, data.password, fullName);
      
      // Check if the user needs to verify their email
      if (result?.user?.confirmation_sent_at) {
        toast.success('Te hemos enviado un correo de confirmación. Por favor verifica tu cuenta.');
      } else {
        toast.success('Cuenta creada exitosamente.');
      }
      
      // Short delay before redirecting
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      if (error.message.includes('ya está registrado')) {
        toast.error(error.message);
      } else {
        toast.error(error.message || 'Error al crear la cuenta. Intenta nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-6">
      <TypographyH2 className="!m-0 !p-0 text-xl md:text-2xl">Cree su nueva cuenta</TypographyH2>
      <p className="!m-0 text-balance !p-0 text-sm text-muted-foreground">
        Ingresa tus datos abajo para crear tu cuenta.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-[350px] flex-col gap-y-2.5">
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <FormField
              control={form.control}
              name="names"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombres</FormLabel>
                  <FormControl>
                    <Input placeholder="Jhon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_names"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellidos</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="correo@ejemplo.com" {...field} />
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
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={showPassword ? 'text' : 'password'} placeholder="********" {...field} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <PasswordStrengthIndicator password={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="********" {...field} />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Al hacer clic en Regístrate, aceptas nuestras{' '}
              <Link href="#" className="text-blue-500">
                Condiciones
              </Link>
              ,{' '}
              <Link href="#" className="text-blue-500">
                Política de privacidad{' '}
              </Link>
              y{' '}
              <Link href="#" className="text-blue-500">
                Política de cookies
              </Link>
              .
            </p>
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <p>Regístrate</p>}
          </Button>
          
          <div className="mt-2 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-blue-500 hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>
      </Form>

      {/* Separador visual */}
      <div className="relative w-full max-w-[350px]">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
        </div>
      </div>

      {/* Botón para continuar con Google */}
      <div className="w-full max-w-[350px]">
        <Button variant="outline" className="w-full" type="button" onClick={signInWithGoogle} disabled={isSubmitting}>
          <>
            {/* Ícono de Google (SVG) */}
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-label="Google">
              <title>Google</title>
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </>
        </Button>
      </div>
    </div>
  );
}
