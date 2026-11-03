import { Link } from 'react-router-dom';
import { passwordRules } from '@gai2e/shared-types';
import { Alert, Button, InputPassword, PasswordCheck } from '@gai2e/ui';
import AuthWrapper from './auth-wrapper';
import { useResetPasswordForm } from './hooks/use-reset-password-form';

const ResetPassword = () => {
  const { register, errors, onSubmit, isLoading, hasToken, password } = useResetPasswordForm();

  if (!hasToken) {
    return (
      <AuthWrapper title="Lien incomplet">
        <Alert variant="error">
          Ce lien de réinitialisation est incomplet. Ouvrez le lien reçu par email, ou faites une nouvelle demande.
        </Alert>
        <Button link="/forgot-password" variant="cta" size="lg" className="mt-8 w-full">
          Faire une nouvelle demande
        </Button>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper title="Nouveau mot de passe" description="Choisissez le mot de passe de votre compte.">
      <form onSubmit={onSubmit} noValidate>
        {errors.root && (
          <Alert variant="error" className="mb-5">
            {errors.root.message}{' '}
            <Link to="/forgot-password" className="font-medium underline">
              Faire une nouvelle demande
            </Link>
          </Alert>
        )}
        <InputPassword
          label="Nouveau mot de passe"
          autoComplete="new-password"
          placeholder="••••••••"
          customClassContainer="mb-3"
          {...register('password')}
          error={errors.password}
        />
        <PasswordCheck value={password} rules={passwordRules} />
        <InputPassword
          label="Confirmation du mot de passe"
          autoComplete="new-password"
          placeholder="••••••••"
          {...register('passwordConfirmation')}
          error={errors.passwordConfirmation}
        />
        <Button type="submit" variant="cta" size="lg" className="mt-4 w-full" isLoading={isLoading}>
          Enregistrer le mot de passe
        </Button>
      </form>
    </AuthWrapper>
  );
};

export default ResetPassword;
