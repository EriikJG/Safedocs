// // "use client";
// 
// // import { useState, useEffect } from "react";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Textarea } from "@/components/ui/textarea";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Label } from "@/components/ui/label";
// // import { Copy, Share2, Calendar, User, Search, Clock, Shield } from "lucide-react";
// // import { toast } from "sonner";
// // import { 
// //   documentShareService, 
// //   UserForSharing, 
// //   CreateSimpleShare 
// // } from "@/services/documentShare.service";
// 
// interface ShareDocumentDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   documentId: string;
//   documentTitle: string;
// }
// 
// export function ShareDocumentDialog({
//   open,
//   onOpenChange,
//   documentId,
//   documentTitle,
// }: ShareDocumentDialogProps) {
//   // Estados del formulario
//   const [formData, setFormData] = useState<CreateSimpleShare>({
//     documentId: "",
//     sharedWithUserId: "",
//     permissionLevel: "read",
//     expiresInHours: 24,
//     shareTitle: "",
//     shareMessage: "",
//   });
// 
//   // Estados de UI
//   const [loading, setLoading] = useState(false);
//   const [users, setUsers] = useState<UserForSharing[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [step, setStep] = useState<"form" | "success">("form");
//   const [shareToken, setShareToken] = useState("");
// 
//   // Cargar datos iniciales al abrir el diálogo
//   useEffect(() => {
//     if (open) {
//       setTitle(`${documentTitle} - Documento compartido`);
//       setMessage(`Te comparto este documento: ${documentTitle}`);
//     } else {
//       // Reset form when closing
//       setStep("form");
//       setSelectedUserId("");
//       setTitle("");
//       setMessage("");
//       setExpiresAt("");
//       setShareUrl("");
//       setSearchQuery("");
//       setUsers([]);
//     }
//   }, [open, documentTitle]);
// 
//   // Búsqueda de usuarios con debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchQuery.length >= 3) {
//         searchUsers();
//       } else {
//         setUsers([]);
//       }
//     }, 500); // Debounce de 500ms
// 
//     return () => clearTimeout(timer);
//   }, [searchQuery]);
// 
//   const searchUsers = async () => {
//     if (searchQuery.length < 3) return;
//     
//     setSearchLoading(true);
//     try {
//       const result = await documentShareService.searchUsersForSharing(searchQuery);
//       setUsers(result.users || []);
//       if (result.message && result.users.length === 0) {
//         // Mostrar mensaje si no hay resultados
//         console.log(result.message);
//       }
//     } catch (error) {
//       console.error("Error searching users:", error);
//       toast.error("Error al buscar usuarios");
//       setUsers([]);
//     } finally {
//       setSearchLoading(false);
//     }
//   };
// 
//   const handleShare = async () => {
//     if (!selectedUserId) {
//       toast.error("Selecciona un usuario para compartir");
//       return;
//     }
// 
//     setLoading(true);
//     try {
//       const shareData = {
//         sharedWithUserId: selectedUserId,
//         title: title.trim(),
//         message: message.trim(),
//         expiresAt: expiresAt || undefined,
//       };
// 
//       const result = await documentShareService.createSecureShare(documentId, shareData);
//       setShareUrl(result.share_url);
//       setStep("success");
//       toast.success("Documento compartido exitosamente");
//     } catch (error) {
//       console.error("Error sharing document:", error);
//       toast.error(
//         error instanceof Error ? error.message : "Error al compartir documento"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };
// 
//   const handleCopyUrl = async () => {
//     try {
//       await navigator.clipboard.writeText(shareUrl);
//       toast.success("URL copiada al portapapeles");
//     } catch (error) {
//       toast.error("Error al copiar URL");
//     }
//   };
// 
//   const getTomorrowDate = () => {
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     return tomorrow.toISOString().slice(0, 16);
//   };
// 
//   const getNextWeekDate = () => {
//     const nextWeek = new Date();
//     nextWeek.setDate(nextWeek.getDate() + 7);
//     return nextWeek.toISOString().slice(0, 16);
//   };
// 
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         {step === "form" ? (
//           <>
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <Share2 className="h-5 w-5" />
//                 Compartir Documento
//               </DialogTitle>
//               <DialogDescription>
//                 Comparte &quot;{documentTitle}&quot; de forma segura con otro usuario
//               </DialogDescription>
//             </DialogHeader>
// 
//             <div className="space-y-4">
//               {/* Búsqueda de usuario */}
//               <div className="space-y-2">
//                 <Label htmlFor="user-search" className="flex items-center gap-2">
//                   <Search className="h-4 w-4" />
//                   Buscar usuario
//                 </Label>
//                 <Input
//                   id="user-search"
//                   placeholder="Buscar por nombre o empresa (mín. 3 caracteres)..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//                 
//                 {/* Lista de resultados */}
//                 {searchQuery.length >= 3 && (
//                   <div className="border rounded-md max-h-40 overflow-y-auto">
//                     {searchLoading ? (
//                       <div className="p-3 text-center text-sm text-gray-500">
//                         Buscando usuarios...
//                       </div>
//                     ) : users.length > 0 ? (
//                       users.map((user) => (
//                         <div
//                           key={user.id}
//                           className={`p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${
//                             selectedUserId === user.id ? 'bg-blue-50 border-blue-200' : ''
//                           }`}
//                           onClick={() => {
//                             setSelectedUserId(user.id);
//                             setSearchQuery(user.name);
//                           }}
//                         >
//                           <div className="flex items-center gap-3">
//                             {user.avatar ? (
//                               <img 
//                                 src={user.avatar} 
//                                 alt={user.name}
//                                 className="w-8 h-8 rounded-full"
//                               />
//                             ) : (
//                               <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
//                                 <User className="h-4 w-4 text-gray-500" />
//                               </div>
//                             )}
//                             <div>
//                               <div className="font-medium text-sm">{user.name}</div>
//                               {user.company && (
//                                 <div className="text-xs text-gray-500">{user.company}</div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))
//                     ) : searchQuery.length >= 3 ? (
//                       <div className="p-3 text-center text-sm text-gray-500">
//                         No se encontraron usuarios
//                       </div>
//                     ) : null}
//                   </div>
//                 )}
//               </div>
// 
//               {/* Título personalizado */}
//               <div className="space-y-2">
//                 <Label htmlFor="title">Título del compartir</Label>
//                 <Input
//                   id="title"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   placeholder="Título personalizado..."
//                 />
//               </div>
// 
//               {/* Mensaje personalizado */}
//               <div className="space-y-2">
//                 <Label htmlFor="message">Mensaje (opcional)</Label>
//                 <Textarea
//                   id="message"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder="Mensaje para el destinatario..."
//                   rows={3}
//                 />
//               </div>
// 
//               {/* Fecha de expiración */}
//               <div className="space-y-2">
//                 <Label htmlFor="expires" className="flex items-center gap-2">
//                   <Calendar className="h-4 w-4" />
//                   Expira el (opcional)
//                 </Label>
//                 <div className="flex gap-2">
//                   <Input
//                     id="expires"
//                     type="datetime-local"
//                     value={expiresAt}
//                     onChange={(e) => setExpiresAt(e.target.value)}
//                     min={new Date().toISOString().slice(0, 16)}
//                   />
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setExpiresAt(getTomorrowDate())}
//                   >
//                     +1d
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setExpiresAt(getNextWeekDate())}
//                   >
//                     +7d
//                   </Button>
//                 </div>
//               </div>
//             </div>
// 
//             <DialogFooter>
//               <Button variant="outline" onClick={() => onOpenChange(false)}>
//                 Cancelar
//               </Button>
//               <Button onClick={handleShare} disabled={loading || !selectedUserId}>
//                 {loading ? "Compartiendo..." : "Compartir"}
//               </Button>
//             </DialogFooter>
//           </>
//         ) : (
//           <>
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2 text-green-600">
//                 <Share2 className="h-5 w-5" />
//                 ¡Documento Compartido!
//               </DialogTitle>
//               <DialogDescription>
//                 El documento ha sido compartido exitosamente
//               </DialogDescription>
//             </DialogHeader>
// 
//             <div className="space-y-4">
//               <div className="p-4 bg-green-50 rounded-lg border border-green-200">
//                 <p className="text-sm text-green-700 mb-2">
//                   URL de acceso seguro:
//                 </p>
//                 <div className="flex gap-2">
//                   <Input
//                     value={shareUrl}
//                     readOnly
//                     className="font-mono text-xs"
//                   />
//                   <Button size="sm" onClick={handleCopyUrl}>
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
// 
//               <div className="text-sm text-gray-600">
//                 <p>• El destinatario recibirá acceso de solo lectura</p>
//                 <p>• El enlace es seguro y único</p>
//                 {expiresAt && (
//                   <p>• Expira el {new Date(expiresAt).toLocaleString()}</p>
//                 )}
//               </div>
//             </div>
// 
//             <DialogFooter>
//               <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
//             </DialogFooter>
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }

// Componente placeholder para que el build funcione
export function ShareDocumentDialog() {
  return null;
}
