import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const calculateStrength = (password: string): number => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength;
  };

  const getStrengthText = (strength: number): string => {
    switch (strength) {
      case 0:
        return 'Muy débil';
      case 1:
        return 'Débil';
      case 2:
        return 'Regular';
      case 3:
        return 'Buena';
      case 4:
        return 'Fuerte';
      case 5:
        return 'Muy fuerte';
      default:
        return '';
    }
  };

  const getStrengthColor = (strength: number): string => {
    switch (strength) {
      case 0:
        return 'bg-red-500';
      case 1:
        return 'bg-red-400';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-yellow-400';
      case 4:
        return 'bg-green-500';
      case 5:
        return 'bg-green-400';
      default:
        return 'bg-gray-200';
    }
  };

  const strength = calculateStrength(password);
  const strengthText = getStrengthText(strength);
  const strengthColor = getStrengthColor(strength);
  const strengthPercentage = (strength / 5) * 100;

  return (
    <div className="flex w-full items-center justify-between">
      <div className="h-2 w-full max-w-[calc(100%-80px)] rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
          style={{ width: `${strengthPercentage}%` }}
        />
      </div>
      <p className="min-w-[70px] text-right text-sm text-muted-foreground">{strengthText}</p>
    </div>
  );
}
