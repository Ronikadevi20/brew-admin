/**
 * Password Strength Indicator Component
 * 
 * Shows real-time password strength feedback with visual indicators.
 */

import { useMemo } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculatePasswordStrength, type PasswordStrength } from '@/lib/validation';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
  className?: string;
}

const strengthConfig: Record<PasswordStrength, { label: string; color: string; bgColor: string }> = {
  weak: { label: 'Weak', color: 'text-red-500', bgColor: 'bg-red-500' },
  fair: { label: 'Fair', color: 'text-orange-500', bgColor: 'bg-orange-500' },
  good: { label: 'Good', color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
  strong: { label: 'Strong', color: 'text-green-500', bgColor: 'bg-green-500' },
};

export function PasswordStrengthIndicator({
  password,
  showRequirements = true,
  className,
}: PasswordStrengthIndicatorProps) {
  const strengthResult = useMemo(() => calculatePasswordStrength(password), [password]);
  const config = strengthConfig[strengthResult.strength];

  if (!password) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Password strength</span>
          <span className={cn('text-xs font-medium', config.color)}>{config.label}</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-300 rounded-full', config.bgColor)}
            style={{ width: `${(strengthResult.score / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <RequirementItem
            met={strengthResult.checks.minLength}
            label="8+ characters"
          />
          <RequirementItem
            met={strengthResult.checks.hasUppercase}
            label="Uppercase letter"
          />
          <RequirementItem
            met={strengthResult.checks.hasLowercase}
            label="Lowercase letter"
          />
          <RequirementItem
            met={strengthResult.checks.hasNumber}
            label="Number"
          />
        </div>
      )}
    </div>
  );
}

interface RequirementItemProps {
  met: boolean;
  label: string;
}

function RequirementItem({ met, label }: RequirementItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      {met ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <X className="w-3.5 h-3.5 text-muted-foreground/50" />
      )}
      <span
        className={cn(
          'text-xs transition-colors',
          met ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * Compact password strength indicator (just the bar)
 */
interface PasswordStrengthBarProps {
  password: string;
  className?: string;
}

export function PasswordStrengthBar({ password, className }: PasswordStrengthBarProps) {
  const strengthResult = useMemo(() => calculatePasswordStrength(password), [password]);
  const config = strengthConfig[strengthResult.strength];

  if (!password) {
    return null;
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-200',
              level <= strengthResult.score ? config.bgColor : 'bg-secondary'
            )}
          />
        ))}
      </div>
      <p className={cn('text-xs', config.color)}>{config.label}</p>
    </div>
  );
}

export default PasswordStrengthIndicator;