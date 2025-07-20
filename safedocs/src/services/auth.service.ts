// 🔐 Servicio de autenticación con HttpOnly Cookies + Supabase
import { API_CONFIG } from '@/config/api'
import { apiClient } from '@/lib/api-client'

export interface AuthUser {
  id: string
  email: string
  username?: string
  name?: string
  role?: string
  created_at: string
  updated_at: string
  email_confirmed?: boolean
}

/**
 * 🔒 Gestor de tokens seguro usando HttpOnly Cookies (integrado)
 */
class CookieSecureTokenManager {
  private static readonly USER_KEY = 'safedocs_user_info';
  private static readonly SESSION_ACTIVE_KEY = 'safedocs_session_active';

  static setUserSession(user: AuthUser): void {
    if (typeof window === 'undefined') return;

    try {
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

  static hasActiveSession(): boolean {
    if (typeof window === 'undefined') return false;
    
    const sessionActive = sessionStorage.getItem(this.SESSION_ACTIVE_KEY);
    const userData = sessionStorage.getItem(this.USER_KEY);
    
    return !!(sessionActive === 'true' && userData);
  }

  static clearSession(): void {
    if (typeof window === 'undefined') return;

    sessionStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.SESSION_ACTIVE_KEY);
    
    console.log('🔐 Sesión local limpiada');
  }

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
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  username: string
  name: string
}

// Ya no necesitamos AuthSession porque los tokens van en cookies HttpOnly
export interface AuthSession {
  access_token?: string  // Solo para compatibilidad con código existente
  refresh_token?: string
  expires_at?: number
}

export interface AuthResponse {
  success?: boolean
  data?: {
    user: AuthUser | null
    // session ya no viene en la respuesta porque va en cookies
  }
  user?: AuthUser | null
  session?: AuthSession | null  // Para compatibilidad, pero estará vacío
  error?: string
  message?: string
  requiresEmailConfirmation?: boolean
}

export interface IAuthService {
  login(data: LoginData): Promise<AuthResponse>
  register(data: RegisterData): Promise<AuthResponse>
  logout(): Promise<void>
  getCurrentUser(): Promise<AuthUser | null>
  refreshSession(): Promise<AuthResponse>
  isAuthenticated(): Promise<boolean>
  getStoredUser(): AuthUser | null
  hasValidTokens(): boolean  // Para compatibilidad con código existente
}

/**
 * 🌐 Servicio de autenticación con HttpOnly Cookies + Supabase
 * Los tokens se manejan automáticamente por el navegador
 */
class CookieAuthService implements IAuthService {
  
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log('🔐 AuthService - Enviando login al backend (cookies):', { email: data.email });
      
      // El backend configurará las cookies automáticamente
      const response = await apiClient.post('/auth/login', data)
      console.log('🔐 AuthService - Respuesta completa del backend:', response);
      
      // Verificar si la respuesta tiene éxito
      if (response.success && response.data) {
        const { user } = response.data;
        console.log('🔐 AuthService - Usuario extraído:', user);
        
        if (user) {
          // Verificar si el email está confirmado
          if (!user.email_confirmed) {
            console.log('🔐 AuthService - Email no verificado');
            return {
              user,
              session: null,
              requiresEmailConfirmation: true,
              error: 'Por favor verifica tu email antes de iniciar sesión'
            };
          }

          // 🍪 Solo guardar datos del usuario (tokens van en cookies HttpOnly)
          CookieSecureTokenManager.setUserSession(user);
          
          const result = { 
            user, 
            session: {} as AuthSession  // Sesión vacía por compatibilidad
          };
          console.log('🔐 AuthService - Login exitoso, resultado final:', result);
          return result;
        } else {
          // Usuario registrado pero necesita confirmar email
          console.log('🔐 AuthService - Usuario necesita confirmar email');
          return { 
            user, 
            session: null, 
            requiresEmailConfirmation: true 
          }
        }
      }
      
      // Si llegamos aquí, significa que el login falló
      console.error('🔐 AuthService - Login fallido. Respuesta del backend:', response);
      
      // Mejorar el manejo de errores específicos
      let errorMessage = 'Error en el login';
      
      if (response.error) {
        const error = response.error.toLowerCase();
        console.log('🔐 AuthService - Error detectado:', error);
        
        if (error.includes('invalid login credentials') || error.includes('credenciales inválidas')) {
          errorMessage = 'Email o contraseña incorrectos';
        } else if (error.includes('email not confirmed')) {
          errorMessage = 'Por favor confirma tu email antes de iniciar sesión';
        } else if (error.includes('too many requests')) {
          errorMessage = 'Demasiados intentos de login. Intenta más tarde';
        } else {
          errorMessage = response.error;
        }
      } else if (!response.success) {
        // Si no hay campo de error pero success es false
        errorMessage = 'Credenciales incorrectas';
      }
      
      console.error('🔐 AuthService - Retornando error:', errorMessage);
      return { 
        user: null, 
        session: null, 
        error: errorMessage 
      }
    } catch (error) {
      console.error('🔐 AuthService - Excepción en login:', error)
      
      // Mejorar el manejo de errores de conexión
      let errorMessage = 'Error de conexión';
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = 'Tiempo de espera agotado. Verifica tu conexión';
        } else if (error.message.includes('fetch')) {
          errorMessage = 'No se pudo conectar con el servidor';
        } else {
          errorMessage = error.message;
        }
      }
      
      return { 
        user: null, 
        session: null, 
        error: errorMessage 
      }
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // El backend configurará las cookies automáticamente si hay auto-login
      const response = await apiClient.post('/auth/register', data)
      console.log('🔐 AuthService - Respuesta de registro:', response);
      
      if (response.success && response.data) {
        const { user } = response.data;
        
        if (user) {
          // En el registro, no guardamos la sesión automáticamente
          // El usuario debe verificar su email primero
          return { 
            user,
            session: null,
            requiresEmailConfirmation: true,
            message: 'Registro exitoso. Por favor verifica tu email.'
          }
        } else {
          return { 
            user: null,
            session: null,
            error: 'Error en el registro'
          }
        }
      }
      
      return { 
        user: null, 
        session: null, 
        error: response.error || 'Error en el registro' 
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { 
        user: null, 
        session: null, 
        error: 'Error de conexión' 
      }
    }
  }

  async logout(): Promise<void> {
    try {
      // El backend limpiará las cookies HttpOnly automáticamente
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Siempre limpiar el storage local
      CookieSecureTokenManager.clearSession()
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      console.log('🔐 getCurrentUser - Obteniendo usuario del backend');
      
      // Las cookies se envían automáticamente con la request
      const response = await apiClient.get('/auth/me')
      console.log('🔐 getCurrentUser - Respuesta:', response);
      
      if (response.success && response.data) {
        const user = response.data;
        console.log('🔐 getCurrentUser - Usuario obtenido:', user);
        
        // Actualizar datos locales del usuario
        CookieSecureTokenManager.setUserSession(user);
        
        return user
      }
      
      console.log('🔐 getCurrentUser - Respuesta inválida del backend');
      return null
    } catch (error) {
      console.error('🔐 getCurrentUser - Error:', error)
      // Si hay error de autenticación, limpiar sesión local
      CookieSecureTokenManager.clearSession()
      return null
    }
  }

  async refreshSession(): Promise<AuthResponse> {
    try {
      // El backend maneja el refresh usando cookies automáticamente
      const response = await apiClient.post('/auth/refresh')
      
      if (response.success && response.data) {
        const user = response.data;
        
        // Actualizar datos del usuario
        CookieSecureTokenManager.setUserSession(user)
        
        return { 
          user, 
          session: {} as AuthSession  // Sesión vacía por compatibilidad
        }
      }
      
      return { 
        user: null, 
        session: null, 
        error: response.error || 'Error renovando sesión' 
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      CookieSecureTokenManager.clearSession()
      return { 
        user: null, 
        session: null, 
        error: 'Error de conexión' 
      }
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      return !!user
    } catch {
      return false
    }
  }

  getStoredUser(): AuthUser | null {
    return CookieSecureTokenManager.getUser()
  }

  // Para compatibilidad con código existente
  hasValidTokens(): boolean {
    // Con cookies HttpOnly, verificamos si hay sesión activa localmente
    // La validación real se hace en getCurrentUser()
    return CookieSecureTokenManager.hasActiveSession()
  }
}

/**
 * 🔐 Instancia singleton del servicio de autenticación
 * Usa HttpOnly Cookies para máxima seguridad
 */
export const authService = new CookieAuthService()
