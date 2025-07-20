// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import {
//   Send,
//   Share2,
//   Users,
//   Clock,
//   Copy,
//   //Eye,
//   MessageCircle,
// } from 'lucide-react';

// import { useAuth } from '@/contexts/AuthContext';
// //import { supabase } from '@/lib/supabase';
// //import { useShareChat } from '@/hooks/useShareChat';
// import { useConnectedUsers } from '@/hooks/useConnectedUsers';

// import { DashboardTitle } from '@/components/Sliderbar/DashboardTitle';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// //import { Badge } from '@/components/ui/badge';
// import { Alert, AlertDescription } from '@/components/ui/alert';

// export default function SharePage() {
//   /* Auth */
//   const { user, loading } = useAuth();
//   const router = useRouter();
//   const { share_token } = useParams<{ share_token: string }>();

//   /** UUID real */
//   const [shareUuid, setShareUuid] = useState<string | null>(null);
//   const [lookupDone, setLookupDone] = useState(false);
//   /* Buscar uuid una sola vez */
//   // useEffect(() => {
//   //   if (!share_token) return;

//   //   const fetchUuid = async () => {
//   //     const { data, error } = await supabase
//   //       .from('document_shares')
//   //       .select('id, title, message, created_by')
//   //       .eq('share_token', share_token)
//   //       .eq('is_active', true)
//   //       .maybeSingle();

//   //     if (!error && data) {
//   //       setShareUuid(data.id);
//   //       // Opcional: establecer información adicional del chat
//   //     } else {
//   //       console.error('Error fetching share:', error);
//   //     }
//   //     setLookupDone(true);
//   //   };

//   //   fetchUuid();
//   // }, [share_token]);

//   /* Proteger si no login */
//   useEffect(() => {
//     if (!loading && !user) router.replace('/');
//   }, [user, loading, router]);
//   /* Hook realtime (solo cuando ya sabemos uuid) */
//   const {
//     messages,
//     loading: loadingChat,
//     sendMessage,
//     forceUpdate,
//   } = useShareChat(shareUuid ?? '', user?.id);

//   /* Hook para usuarios conectados */
//   const { users: connectedUsers, loading: loadingUsers } = useConnectedUsers(shareUuid ?? '');

//   /** UI State */
//   const [draft, setDraft] = useState('');
//   const messagesEndRef = useRef<HTMLDivElement>(null);
  
//   // Scroll automático cuando lleguen nuevos mensajes
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages, forceUpdate]);

//   // Forzar re-render cuando cambien los mensajes
//   useEffect(() => {
//     // Este efecto se ejecuta cada vez que cambian los mensajes
//     // Ayuda a asegurar que la UI se actualice
//     console.log('Messages updated:', messages.length);
//   }, [messages.length, forceUpdate]);

//   /** Helpers */
//   const handleSend = () => {
//     if (!draft.trim()) return;
//     sendMessage(draft);
//     setDraft('');
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const copyShareLink = () => {
//     const link = `${share_token}`;
//     navigator.clipboard.writeText(link).then(() => {
//       // Podrías agregar una notificación aquí
//       console.log('Enlace copiado al portapapeles');
//     });
//   };
//   /* Carga inicial / token incorrecto */
//   if (loading || !lookupDone) return null;
//   if (!shareUuid) {
//     return (
//       <div className="p-8 text-center">
//         <h1 className="text-xl font-semibold mb-2">Chat no encontrado</h1>
//         <p className="text-muted-foreground mb-4">
//           Este enlace de chat no existe, ha expirado o no está activo.
//         </p>
//         <div className="space-x-4">
//           <Button onClick={() => router.push('/share')}>
//             Ir al Chat Principal
//           </Button>
//           <Button variant="outline" onClick={() => router.push('/share/new')}>
//             Crear Nuevo Chat
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   /* --- UI --- */
//   return (
//     <>
//       <DashboardTitle>Chat Grupal</DashboardTitle>

//       <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 lg:p-6 min-h-0 overflow-hidden">        {/* CHAT */}
//         <div className="lg:col-span-2 space-y-4">
//           <Card className="h-[600px] flex flex-col">
//             <CardHeader className="pb-3 flex-shrink-0">
//               <div className="flex items-center justify-between">
//                 <div className="min-w-0 flex-1">
//                   <CardTitle className="flex items-center gap-2">
//                     <MessageCircle className="h-5 w-5 flex-shrink-0" />
//                     <span className="truncate">Chat Seguro</span>
//                   </CardTitle>
//                   <CardDescription className="truncate">
//                     {connectedUsers.length} usuarios activos en las últimas 24h
//                   </CardDescription>
//                 </div>
//                 <div className="flex items-center gap-2 flex-shrink-0">
//                   <div className="w-2 h-2 bg-green-500 rounded-full" />
//                   <span className="text-sm text-green-600 hidden sm:inline">En línea</span>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={copyShareLink}
//                     className="ml-2"
//                   >
//                     <Copy className="h-3 w-3 mr-1" />
//                     <span className="hidden sm:inline">Compartir</span>
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>

//             <CardContent className="flex-1 flex flex-col p-4 min-h-0">
//               {/* Mensajes */}
//               <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 min-h-0" key={`messages-${forceUpdate}`}>
//                 {loadingChat && (
//                   <p className="text-sm text-muted-foreground">Cargando…</p>
//                 )}
//                 {messages.map((msg, index) => (
//                   <div
//                     key={`${msg.id}-${index}-${forceUpdate}`}
//                     className={`flex ${
//                       msg.sender_id === user?.id
//                         ? 'justify-end'
//                         : 'justify-start'
//                     }`}
//                   >
//                     <div className="max-w-[85%] sm:max-w-[70%] min-w-0">
//                       {msg.msg_type === 'system' ? (
//                         <Alert>
//                           <AlertDescription className="text-center text-sm">
//                             {msg.content}
//                           </AlertDescription>
//                         </Alert>
//                       ) : (
//                         <div
//                           className={`rounded-lg p-3 break-words ${
//                             msg.sender_id === user?.id
//                               ? 'bg-primary text-primary-foreground'
//                               : 'bg-muted'
//                           }`}
//                         >
//                           {/* Mostrar nombre del usuario si no es el remitente actual */}
//                           {msg.sender_id !== user?.id && msg.sender_id && (
//                             <p className="text-xs font-medium opacity-70 mb-1 truncate">
//                               {msg.sender_name || msg.sender_email || 'Usuario'}
//                             </p>
//                           )}
//                           <p className="text-sm whitespace-pre-wrap break-words">
//                             {msg.content}
//                           </p>
//                           <span className="block text-[10px] mt-1 opacity-70">
//                             {new Date(msg.created_at).toLocaleTimeString()}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </div>

//               {/* Input */}
//               <div className="flex gap-2 flex-shrink-0">
//                 <Input
//                   value={draft}
//                   onChange={(e) => setDraft(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   placeholder="Escribe un mensaje…"
//                   className="flex-1 min-w-0"
//                 />
//                 <Button onClick={handleSend} disabled={!draft.trim()} className="flex-shrink-0">
//                   <Send className="h-4 w-4" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* SIDEBAR — solo mock simplificado */}
//         <div className="space-y-4">
//           <Card>            <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Users className="h-4 w-4" />
//                 Usuarios Activos
//               </CardTitle>
//             </CardHeader>            <CardContent className="space-y-2 max-h-60 overflow-y-auto">
//               {loadingUsers ? (
//                 <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
//               ) : connectedUsers.length > 0 ? (
//                 connectedUsers.map((user) => (
//                   <div key={user.id} className="flex items-center gap-3 min-w-0">
//                     <Avatar className="h-8 w-8 flex-shrink-0">
//                       <AvatarFallback>{user.name[0]?.toUpperCase()}</AvatarFallback>
//                       <AvatarImage src={user.avatar_url || ""} />
//                     </Avatar>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium truncate">{user.name}</p>
//                       <p className="text-xs text-muted-foreground truncate">
//                         {user.last_seen ? 
//                           `Último mensaje: ${new Date(user.last_seen).toLocaleTimeString()}` :
//                           'En línea'
//                         }
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-sm text-muted-foreground">No hay usuarios recientes</p>
//               )}
//             </CardContent>
//           </Card>          <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <MessageCircle className="h-4 w-4" />
//                 Información del Chat
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               <div className="text-sm">
//                 <p className="font-medium">Token del Chat:</p>
//                 <code className="text-xs bg-muted px-2 py-1 rounded">{share_token}</code>
//               </div>
//               <div className="text-sm">
//                 <p className="font-medium">Total de mensajes:</p>
//                 <p className="text-muted-foreground">{messages.length}</p>
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={copyShareLink}
//                 className="w-full"
//               >
//                 <Copy className="h-3 w-3 mr-2" />
//                 Copiar Enlace
//               </Button>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Clock className="h-4 w-4" />
//                 Cómo Invitar Usuarios
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-sm text-muted-foreground space-y-2">
//                 <p>• Comparte el enlace del chat con otros usuarios</p>
//                 <p>• Solo usuarios registrados pueden participar</p>
//                 <p>• Los mensajes son en tiempo real</p>
//                 <p>• El historial se mantiene para todos los participantes</p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </>
//   );
// }

// Componente temporal para que el build funcione
export default function SharePage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-xl font-semibold mb-2">Página en Desarrollo</h1>
      <p className="text-muted-foreground">
        Esta funcionalidad está siendo desarrollada.
      </p>
    </div>
  );
}
