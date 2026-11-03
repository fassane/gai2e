import { LuMailCheck } from 'react-icons/lu';
import { Alert, Button, Input } from '@gai2e/ui';
import AuthWrapper from './auth-wrapper';
import { useForgotPasswordForm } from './hooks/use-forgot-password-form';

const ForgotPassword = () => {
  const { register, errors, onSubmit, isLoading, sentTo, restart } = useForgotPasswordForm();

  if (sentTo) {
    return (
      <AuthWrapper title="Vérifiez vos emails">
        <div className="flex flex-col items-center text-center">
          <span className="mb-5 flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <LuMailCheck className="size-7" />
          </span>
          <p className="text-sm text-muted-foreground">
            Si un compte existe avec l'adresse <strong className="text-foreground">{sentTo}</strong>, vous allez
            recevoir un lien pour choisir un nouveau mot de passe. Il est valable une heure.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">Pensez à regarder dans vos courriers indésirables.</p>
          <Button link="/login" variant="cta" size="lg" className="mt-8 w-full">
            Retour à la connexion
          </Button>
          <Button variant="link" size="sm" className="mt-2" onClick={restart}>
            Utiliser une autre adresse
          </Button>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper
      title="Mot de passe oublié"
      description="Indiquez l'adresse email de votre compte : nous vous enverrons un lien pour choisir un nouveau mot de passe."
    >
      <form onSubmit={onSubmit} noValidate>
        {errors.root && (
          <Alert variant="error" className="mb-5">
            {errors.root.message}
          </Alert>
        )}
        <Input
          label="Adresse email"
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          {...register('email')}
          error={errors.email}
        />
        <Button type="submit" variant="cta" size="lg" className="mt-4 w-full" isLoading={isLoading}>
          Recevoir le lien
        </Button>
        <Button link="/login" variant="outline" size="lg" className="mt-3 w-full">
          Retour à la connexion
        </Button>
      </form>
    </AuthWrapper>
  );
};

export default ForgotPassword;
