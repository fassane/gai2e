import { LuCircle, LuCircleCheck } from 'react-icons/lu';
import { cn } from '../lib/utils';

type PasswordRule = { id: string; label: string; test: (value: string) => boolean };

// Liste des règles du mot de passe, cochées au fil de la saisie.
// Les règles viennent de @gai2e/shared-types (passwordRules), les mêmes que celles de l'API.
export function PasswordCheck({
  value,
  rules,
  className,
}: {
  value: string;
  rules: readonly PasswordRule[];
  className?: string;
}) {
  return (
    <div className={cn('mb-4 rounded-2xl bg-muted/60 px-4 py-3', className)}>
      <p className="mb-2 text-xs font-medium text-foreground">Votre mot de passe doit contenir :</p>
      <ul className="grid gap-1.5 sm:grid-cols-2" aria-live="polite">
        {rules.map((rule) => {
          const valid = rule.test(value);
          return (
            <li
              key={rule.id}
              className={cn(
                'flex items-center gap-1.5 text-xs transition-colors',
                valid ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {valid ? <LuCircleCheck className="size-3.5 shrink-0" /> : <LuCircle className="size-3.5 shrink-0" />}
              {rule.label}
              <span className="sr-only">{valid ? ' : respecté' : ' : à respecter'}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
