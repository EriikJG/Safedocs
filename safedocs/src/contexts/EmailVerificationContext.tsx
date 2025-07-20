// context/EmailVerificationContext.tsx
'use client'; // Solo si usas Next.js App Router con componentes cliente

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define la estructura del estado
type EmailVerificationState = {
  show: boolean;
  email: string;
};

// Define el tipo del contexto
type EmailVerificationContextType = EmailVerificationState & {
  setState: React.Dispatch<React.SetStateAction<EmailVerificationState>>;
};

// Crear el contexto
const EmailVerificationContext = createContext<EmailVerificationContextType | undefined>(undefined);

// Proveedor del contexto
export const EmailVerificationProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<EmailVerificationState>({
    show: false,
    email: '',
  });

  return (
    <EmailVerificationContext.Provider value={{ ...state, setState }}>
      {children}
    </EmailVerificationContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useEmailVerification = () => {
  const context = useContext(EmailVerificationContext);
  if (!context) {
    throw new Error('useEmailVerification debe usarse dentro de un EmailVerificationProvider');
  }
  return context;
};
