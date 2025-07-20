# 🔐 Consulta sobre Arquitectura de Permisos para Sistema de Compartir Documentos

## 📋 **Contexto Actual**

Estamos implementando un sistema de compartir documentos en el frontend y necesitamos clarificar los permisos de acceso a usuarios del sistema.

### 🎯 **Funcionalidad que Queremos Implementar**
- Los usuarios puedan compartir documentos con otros usuarios registrados
- Para esto, necesitan poder ver la lista de usuarios disponibles en el sistema
- Los usuarios compartidos tendrán acceso de solo lectura a los documentos

## 🤔 **Preguntas sobre Permisos**

### **1. ¿Quién puede ver la lista de usuarios?**
Actualmente entendemos que:
- ✅ **Admins**: Pueden ver todos los usuarios (`/auth/users` o similar)
- ❓ **Usuarios normales**: ¿Pueden ver otros usuarios para compartir documentos?

### **2. Propuesta de Arquitectura de Permisos**

#### **Opción A: Separar Funcionalidades por Rol**
```
👑 ADMIN
├── Ver todos los usuarios
├── Asignar/cambiar roles  
├── Gestionar usuarios (crear/eliminar/suspender)
└── Acceso completo al sistema

👤 USER (Usuario Normal)
├── Ver lista de usuarios (solo para compartir)
├── Compartir sus propios documentos
├── Ver documentos compartidos con él
└── NO puede cambiar roles ni gestionar usuarios
```

#### **Opción B: Endpoints Separados**
```
🔧 ENDPOINTS ADMINISTRATIVOS (Solo Admin)
├── GET /admin/users (gestión completa)
├── PUT /admin/users/:id/role (cambiar roles)
├── DELETE /admin/users/:id (eliminar usuarios)

📤 ENDPOINTS PARA COMPARTIR (Usuarios normales)
├── GET /share/available-users (solo para compartir)
├── POST /documents/:id/share (compartir documento)
├── GET /documents/shared-with-me (ver compartidos)
```

## 📝 **Preguntas Específicas para el Backend**

### **1. Endpoint para Lista de Usuarios**
```typescript
// ¿Existe este endpoint y quién puede acceder?
GET /auth/users
// o
GET /users
// o necesitamos crear
GET /share/available-users
```

### **2. Información que Necesitamos**
```typescript
interface UserForSharing {
  id: string;           // Para el compartir
  email: string;        // Para mostrar al usuario
  name?: string;        // Nombre display (opcional)
  // NO necesitamos: role, created_at, last_login, etc.
}
```

### **3. Filtros Recomendados**
- ¿Excluir al usuario actual de la lista?
- ¿Excluir usuarios inactivos/suspendidos?
- ¿Mostrar solo usuarios con ciertos roles?

## 🛡️ **Consideraciones de Seguridad**

### **¿Es Seguro que los Usuarios Vean Otros Usuarios?**
- ✅ **Pro**: Necesario para funcionalidad de compartir
- ⚠️ **Contra**: Podría exponer información (emails, nombres)
- 🔒 **Mitigación**: Limitar información expuesta, solo mostrar lo mínimo necesario

### **Alternativas de Seguridad**
1. **Búsqueda por Email**: En lugar de lista completa, permitir buscar por email específico
2. **Lista Limitada**: Solo mostrar información mínima (id, email ofuscado)
3. **Permisos Granulares**: Configurar qué usuarios pueden compartir con quién

## 🚀 **Implementación Propuesta**

### **Frontend (Lo que estamos haciendo)**
```typescript
// En ShareDocumentDialog.tsx
const loadUsers = async () => {
  try {
    // ¿Qué endpoint usar?
    const users = await documentShareService.getUsers();
    setUsers(users);
  } catch (error) {
    console.error("Error loading users:", error);
  }
};
```

### **Backend (Lo que necesitamos confirmar)**
```typescript
// ¿Crear nuevo endpoint específico para compartir?
GET /share/available-users
Authorization: Bearer {token}

Response: {
  data: [
    {
      id: "user123",
      email: "user@example.com", 
      name: "Usuario Nombre"
    }
  ]
}
```

## ❓ **Preguntas Directas para el Backend**

1. **¿Existe actualmente un endpoint que permita a usuarios normales ver otros usuarios?**

2. **¿Deberíamos crear `/share/available-users` específicamente para la funcionalidad de compartir?**

3. **¿Qué información de usuarios es seguro exponer para la funcionalidad de compartir?**

4. **¿Hay alguna restricción de negocio sobre quién puede compartir con quién?**

5. **¿Prefieren que filtremos en frontend o backend? (ej: excluir usuario actual, usuarios inactivos)**

6. **¿El endpoint actual `/auth/users` está restringido solo a admins por diseño de seguridad?**

## 🎯 **Resultado Esperado**

Queremos asegurar que:
- ✅ Los usuarios puedan compartir documentos de forma segura
- ✅ No comprometamos la seguridad del sistema
- ✅ Sigamos las mejores prácticas de permisos
- ✅ La implementación sea escalable y mantenible

---

**¿Cuál es la mejor manera de implementar esto manteniendo la seguridad y siguiendo la arquitectura actual del sistema?**
