'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type EmailVerificationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  email: string;
};

export function EmailVerificationDialog({ isOpen, onClose, email }: EmailVerificationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verificación de correo</DialogTitle>
          <DialogDescription>
            Hemos detectado que tu correo <strong>{email}</strong> no ha sido verificado.
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-gray-600 mt-2">
          Por favor revisa tu bandeja de entrada y confirma tu cuenta para poder continuar.
        </p>

        <DialogFooter className="mt-4">
          <Button variant="default" onClick={onClose}>
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
