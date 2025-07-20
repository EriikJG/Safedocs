// 'use client';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';
// import { z } from 'zod';
// import { useState, useEffect } from 'react';

// import { Icons } from '@/components/ui/icons';
// import { Button } from '@/components/ui/button';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { TypographyH2 } from '@/components/ui/typography';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { Eye, EyeOff } from 'lucide-react';
// import { PasswordStrengthIndicator } from './password-strength-indicator';
// //} import { supabase } from '@/lib/supabase'; // ❌ DESHABILITADO: Inseguro, usa localStorage

// const formSchema = z
//   .object({
//     password: z
//       .string()
//       .min(8, 'La contraseña debe tener al menos 8 caracteres')
//       .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
//       .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
//       .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
//       .regex(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial'),
//     confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: 'Las contraseñas no coinciden',
//     path: ['confirmPassword'],
//   });

// export default function UpdatePasswordForm() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [updateError, setUpdateError] = useState<string | null>(null);
//   const [updateSuccess, setUpdateSuccess] = useState(false);

//   // Check if the user is in a valid reset session
//   useEffect(() => {
//     const checkSession = async () => {
//       // TODO: Migrar a backend seguro usando apiClient
//       toast.error('Esta funcionalidad se migrará a cookies HttpOnly seguras. Redirigiendo...');
//       router.push('/');
      
//       // const { data, error } = await supabase.auth.getSession();
      
//       // if (error || !data.session) {
//       //   toast.error('Sesión inválida o expirada. Por favor solicita un nuevo enlace de recuperación.');
//       //   router.push('/reset');
//       // }
//     };
    
//     checkSession();
//   }, [router]);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     mode: 'onBlur',
//     defaultValues: {
//       password: '',
//       confirmPassword: '',
//     },
//   });

//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     setIsSubmitting(true);
//     setUpdateError(null);
    
//     try {
//       const { error } = await supabase.auth.updateUser({
//         password: data.password
//       });
      
//       if (error) {
//         throw new Error(error.message);
//       }
      
//       setUpdateSuccess(true);
//       toast.success('Contraseña actualizada con éxito.');
      
//       // Short delay before redirecting
//       setTimeout(() => {
//         router.push('/login');
//       }, 2000);
//     } catch (error: any) {
//       setUpdateError(error.message || 'Error al actualizar la contraseña. Intenta nuevamente.');
//       toast.error('Error al actualizar la contraseña.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex w-full flex-col items-center justify-center gap-y-6">
//       <TypographyH2 className="!m-0 !p-0 text-xl md:text-2xl">Establece tu nueva contraseña</TypographyH2>
//       <p className="!m-0 text-balance !p-0 text-sm text-muted-foreground">
//         Crea una nueva contraseña segura para tu cuenta.
//       </p>

//       {updateSuccess ? (
//         <div className="flex w-full max-w-[350px] flex-col items-center gap-4">
//           <div className="rounded-lg bg-green-50 p-4 text-green-700">
//             <div className="flex items-center">
//               <Icons.check className="mr-2 h-5 w-5 text-green-500" />
//               <p className="text-sm font-medium">Contraseña actualizada</p>
//             </div>
//             <p className="mt-2 text-sm">
//               Tu contraseña ha sido actualizada con éxito. Ahora puedes iniciar sesión con tu nueva contraseña.
//             </p>
//           </div>
//           <Button asChild className="w-full">
//             <Link href="/login">Ir a iniciar sesión</Link>
//           </Button>
//         </div>
//       ) : (
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-[350px] flex-col gap-y-4">
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Nueva contraseña</FormLabel>
//                   <FormControl>
//                     <div className="relative">
//                       <Input type={showPassword ? 'text' : 'password'} placeholder="********" {...field} />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                       >
//                         {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                       </button>
//                     </div>
//                   </FormControl>
//                   <PasswordStrengthIndicator password={field.value} />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
            
//             <FormField
//               control={form.control}
//               name="confirmPassword"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Confirmar nueva contraseña</FormLabel>
//                   <FormControl>
//                     <div className="relative">
//                       <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="********" {...field} />
//                       <button
//                         type="button"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                       >
//                         {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                       </button>
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
            
//             {updateError && (
//               <div className="text-sm font-medium text-destructive mt-1">
//                 {updateError}
//               </div>
//             )}

//             <Button type="submit" className="w-full" disabled={isSubmitting}>
//               {isSubmitting ? (
//                 <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
//               ) : (
//                 "Actualizar contraseña"
//               )}
//             </Button>
            
//             <div className="mt-2 text-center">
//               <p className="text-sm text-muted-foreground">
//                 <Link href="/login" className="text-blue-500 hover:underline">
//                   Volver al inicio de sesión
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </Form>
//       )}
//     </div>
//   );
// }

// Componente temporal para que el build funcione
export default function UpdatePasswordForm() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-6">
      <h2 className="text-xl md:text-2xl font-semibold">Funcionalidad en Desarrollo</h2>
      <p className="text-sm text-muted-foreground text-center">
        La funcionalidad de actualización de contraseña está siendo migrada a un sistema más seguro.
      </p>
    </div>
  );
}
