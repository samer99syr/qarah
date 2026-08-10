import React from 'react';
import { validatePassword, PasswordValidationResult } from '../types';
import { Check, X, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password?: string;
  showDetails?: boolean;
}

export default function PasswordStrengthMeter({ password = '', showDetails = true }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const res: PasswordValidationResult = validatePassword(password);

  const criteria = [
    { label: '10 خانات على الأقل', met: res.hasMinLength },
    { label: 'حرف كبير (A-Z)', met: res.hasUppercase },
    { label: 'حرف صغير (a-z)', met: res.hasLowercase },
    { label: 'رقم واحد على الأقل (0-9)', met: res.hasDigit },
    { label: 'رمز خاص (!@#$%^&*)', met: res.hasSpecialChar }
  ];

  return (
    <div className="mt-2.5 p-3 bg-gray-50/90 border border-gray-200/80 rounded-2xl text-right dir-rtl space-y-2.5 shadow-sm">
      {/* Header with Rating label & score */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {res.isValid ? (
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : res.score >= 50 ? (
            <Shield className="w-4 h-4 text-amber-500 shrink-0" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
          )}
          <span className="font-bold text-gray-700">قوة كلمة المرور:</span>
          <span className="font-extrabold px-2 py-0.5 rounded-lg text-[11px] text-white shadow-xs" style={{ backgroundColor: res.color }}>
            {res.label}
          </span>
        </div>
        <span className="font-mono text-[11px] font-bold text-gray-500">{res.score}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300 rounded-full"
          style={{ width: `${res.score}%`, backgroundColor: res.color }}
        />
      </div>

      {/* Detailed Checklist */}
      {showDetails && (
        <div className="pt-1.5 border-t border-gray-200/60 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
          {criteria.map((item, idx) => (
            <div key={idx} className={`flex items-center gap-1.5 ${item.met ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
              {item.met ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              )}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
