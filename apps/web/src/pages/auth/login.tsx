import { Link } from 'react-router-dom';
import { Alert, Button, Input, InputPassword } from '@gai2e/ui';
import AuthWrapper from './auth-wrapper';
import { useLoginForm } from './hooks/use-login-form';

const Login = () => {
  const { register, errors, onSubmit, isLoading } = useLoginForm();

  return (
    <AuthWrapper title={'Content de vous revoir\u00a0!'} description="Connectez-vous pour suivre votre dossier.">
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
        <InputPassword
          label="Mot de passe"
          autoComplete="current-password"
          placeholder="••••••••"
          customClassContainer="mb-2"
          {...register('password')}
          error={errors.password}
        />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>
        <Button type="submit" variant="cta" size="lg" className="mt-8 w-full" isLoading={isLoading}>
          Se connecter
        </Button>
      </form>
    </AuthWrapper>
  );
};

export default Login;
