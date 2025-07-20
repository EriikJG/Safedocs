// 'use client';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';
// import { z } from 'zod';
// import { useState } from 'react';

// import { Icons } from '@/components/ui/icons';
// import { Button } from '@/components/ui/button';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { TypographyH2 } from '@/components/ui/typography';
// import Link from 'next/link';
// // import { supabase } from '@/lib/supabase'; // ❌ DESHABILITADO: Inseguro, usa localStorage

// const formSchema = z.object({
//   email: z.string().email('Ingresa un correo electrónico válido'),
// });

// export default function ResetForms() {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [resetError, setResetError] = useState<string | null>(null);
//   const [resetSuccess, setResetSuccess] = useState(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     mode: 'onBlur',
//     defaultValues: {
//       email: '',
//     },
//   });

//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     setIsSubmitting(true);
//     setResetError(null);
    
//     try {
//       // TODO: Migrar a backend seguro usando apiClient  
//       setResetError('Esta funcionalidad se migrará a cookies HttpOnly seguras. Por ahora está deshabilitada.');
//       return;
      
//       // const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
//       //   redirectTo: `${window.location.origin}/update-password`,
//       // });
      
//       // if (error) {
//       //   throw new Error(error.message);
//       // }
      
//       // setResetSuccess(true);
//       // toast.success('Te hemos enviado un correo para restablecer tu contraseña.');
//     } catch (error: any) {
//       setResetError(error.message || 'Error al enviar el correo de recuperación. Intenta nuevamente.');
//       toast.error('Error al enviar el correo de recuperación.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex w-full flex-col items-center justify-center gap-y-6">
//       <TypographyH2 className="!m-0 !p-0 text-xl md:text-2xl">Recupera tu contraseña</TypographyH2>
//       <p className="!m-0 text-balance !p-0 text-sm text-muted-foreground">
//         Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
//       </p>

//       {resetSuccess ? (
//         <div className="flex w-full max-w-[350px] flex-col items-center gap-4">
//           <div className="rounded-lg bg-green-50 p-4 text-green-700">
//             <div className="flex items-center">
//               <Icons.check className="mr-2 h-5 w-5 text-green-500" />
//               <p className="text-sm font-medium">Correo enviado con éxito</p>
//             </div>
//             <p className="mt-2 text-sm">
//               Hemos enviado instrucciones para restablecer tu contraseña a tu correo electrónico. Por favor revisa tu bandeja de entrada.
//             </p>
//           </div>
//           <Button asChild className="w-full">
//             <Link href="/login">Volver al inicio de sesión</Link>
//           </Button>
//         </div>
//       ) : (
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-[350px] flex-col gap-y-4">
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Correo Electrónico</FormLabel>
//                   <FormControl>
//                     <Input type="email" placeholder="correo@ejemplo.com" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
            
//             {resetError && (
//               <div className="text-sm font-medium text-destructive mt-1">
//                 {resetError}
//               </div>
//             )}

//             <Button type="submit" className="w-full" disabled={isSubmitting}>
//               {isSubmitting ? (
//                 <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
//               ) : (
//                 "Enviar instrucciones"
//               )}
//             </Button>
            
//             <div className="mt-2 text-center">
//               <p className="text-sm text-muted-foreground">
//                 ¿Recordaste tu contraseña?{' '}
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
export default function ResetForms() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-6">
      <h2 className="text-xl md:text-2xl font-semibold">Funcionalidad en Desarrollo</h2>
      <p className="text-sm text-muted-foreground text-center">
        La funcionalidad de recuperación de contraseña está siendo migrada a un sistema más seguro.
      </p>
    </div>
  );
}
