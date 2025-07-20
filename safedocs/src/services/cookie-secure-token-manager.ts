// 🔒 Gestor de tokens seguro usando HttpOnly Cookies
// Los tokens JWT se manejan automáticamente por el navegador

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  name?: string;
  role?: string;
  created_at: string;
  updated_at: string;
}

export class CookieSecureTokenManager {
  // Solo almacenar datos NO sensibles en sessionStorage
  private static readonly USER_KEY = 'safedocs_user_info';
  private static readonly SESSION_ACTIVE_KEY = 'safedocs_session_active';
  
  // Ya NO necesitamos almacenar tokens porque van en cookies HttpOnly

  /**
   * 💾 Almacena información del usuario (NO sensible)
   * Los tokens JWT van automáticamente en cookies HttpOnly
   */
  static setUserSession(user: AuthUser): void {
    if (typeof window === 'undefined') return;

    try {
      // Solo datos NO sensibles del usuario
      const safeUserData = {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role
      };
      
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(safeUserData));
      sessionStorage.setItem(this.SESSION_ACTIVE_KEY, 'true');
      
      console.log('🔐 Sesión de usuario guardada (sin tokens)');
    } catch (error) {
      console.error('Error storing user session:', error);
    }
  }

  /**
   * 🔍 Los tokens se manejan automáticamente por cookies HttpOnly
   * Ya no necesitamos getAccessToken() porque las cookies van automáticamente
   */
  static hasActiveSession(): boolean {
    if (typeof window === 'undefined') return false;
    
    const sessionActive = sessionStorage.getItem(this.SESSION_ACTIVE_KEY);
    const userData = sessionStorage.getItem(this.USER_KEY);
    
    return !!(sessionActive === 'true' && userData);
  }

  /**
   * 🧹 Limpia toda la sesión
   */
  static clearSession(): void {
    if (typeof window === 'undefined') return;

    sessionStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.SESSION_ACTIVE_KEY);
    
    console.log('🔐 Sesión local limpiada');
  }

  /**
   * 👤 Obtiene datos del usuario
   */
  static getUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = sessionStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * 🔄 Verifica si hay sesión activa pero necesita validar con el servidor
   */
  static needsServerValidation(): boolean {
    if (typeof window === 'undefined') return false;
    
    return this.hasActiveSession();
  }
}
