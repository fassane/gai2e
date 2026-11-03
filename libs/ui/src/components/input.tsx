import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import PhoneInput, { type CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { LuEye, LuEyeOff, LuInfo, LuSearch } from 'react-icons/lu';
import { cn } from '../lib/utils';

// Erreur au format string ou { message } (compatible react-hook-form, sans en dépendre)
type FieldErrorLike = string | { message?: string } | undefined | null;

type FieldProps = {
  label?: string;
  error?: FieldErrorLike;
  fieldHelp?: string;
  customClassContainer?: string;
  customClassInput?: string;
  customClassLabel?: string;
};

// Classes communes à tous les champs
export const fieldControlClass =
  'block min-h-12 w-full rounded-2xl border border-input bg-card px-4 py-2 text-sm text-foreground transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-muted';
const fieldErrorClass = 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20';

export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive" role="alert">
      <LuInfo className="size-3.5 shrink-0" />
      {message}
    </p>
  );
}

export function FormError({ error }: { error?: FieldErrorLike }) {
  const message = typeof error === 'string' ? error : error?.message;
  return <ErrorMessage message={message} />;
}

// Libellé, aide et message d'erreur autour d'un champ
function Field({
  id,
  label,
  required,
  error,
  fieldHelp,
  customClassContainer,
  customClassLabel,
  children,
}: FieldProps & { id?: string; required?: boolean; children: ReactNode }) {
  return (
    <div className={cn('mb-4', customClassContainer)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'mb-1.5 block text-sm font-medium text-foreground',
            required && "after:ml-0.5 after:text-destructive after:content-['*']",
            customClassLabel,
          )}
        >
          {label}
        </label>
      )}
      {children}
      {fieldHelp && <p className="mt-1.5 text-xs text-muted-foreground">{fieldHelp}</p>}
      <FormError error={error} />
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> &
  FieldProps & {
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
  };

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      label,
      required,
      error,
      fieldHelp,
      customClassContainer,
      customClassInput,
      customClassLabel,
      className,
      icon,
      iconPosition = 'left',
      ...rest
    },
    ref,
  ) => {
    const inputId = id ?? name;
    return (
      <Field {...{ id: inputId, label, required, error, fieldHelp, customClassContainer, customClassLabel }}>
        <div className="relative">
          {icon && (
            <span
              className={cn(
                'pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground',
                iconPosition === 'left' ? 'left-4' : 'right-4',
              )}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            name={name}
            required={required}
            aria-invalid={!!error || undefined}
            className={cn(
              fieldControlClass,
              icon && (iconPosition === 'left' ? 'pl-10' : 'pr-10'),
              error && fieldErrorClass,
              customClassInput,
              className,
            )}
            onWheel={(event) => event.currentTarget.blur()}
            {...rest}
          />
        </div>
      </Field>
    );
  },
);
Input.displayName = 'Input';

export const InputPassword = forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'icon' | 'iconPosition'>>(
  (
    {
      id,
      name,
      label,
      required,
      error,
      fieldHelp,
      customClassContainer,
      customClassInput,
      customClassLabel,
      className,
      ...rest
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const inputId = id ?? name;
    return (
      <Field {...{ id: inputId, label, required, error, fieldHelp, customClassContainer, customClassLabel }}>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            name={name}
            required={required}
            type={visible ? 'text' : 'password'}
            aria-invalid={!!error || undefined}
            className={cn(fieldControlClass, 'pr-12', error && fieldErrorClass, customClassInput, className)}
            {...rest}
          />
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {visible ? <LuEye className="size-4" /> : <LuEyeOff className="size-4" />}
          </button>
        </div>
      </Field>
    );
  },
);
InputPassword.displayName = 'InputPassword';

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> &
  FieldProps & {
    placeholder?: string;
    options?: { label: string; value: string | number }[];
    icon?: ReactNode;
  };

// Select natif (léger, idéal sur mobile). Pour un select stylé, voir ./select (Radix).
export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {
      id,
      name,
      label,
      required,
      error,
      fieldHelp,
      customClassContainer,
      customClassInput,
      customClassLabel,
      className,
      placeholder,
      options,
      icon,
      ...rest
    },
    ref,
  ) => {
    const inputId = id ?? name;
    return (
      <Field {...{ id: inputId, label, required, error, fieldHelp, customClassContainer, customClassLabel }}>
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground">
              {icon}
            </span>
          )}
          <select
            ref={ref}
            id={inputId}
            name={name}
            required={required}
            aria-invalid={!!error || undefined}
            className={cn(
              fieldControlClass,
              'cursor-pointer',
              icon && 'pl-10',
              error && fieldErrorClass,
              customClassInput,
              className,
            )}
            {...rest}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </Field>
    );
  },
);
SelectInput.displayName = 'SelectInput';

export const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps>(
  (
    {
      id,
      name,
      label,
      required,
      error,
      fieldHelp,
      customClassContainer,
      customClassInput,
      customClassLabel,
      className,
      rows = 5,
      ...rest
    },
    ref,
  ) => {
    const inputId = id ?? name;
    return (
      <Field {...{ id: inputId, label, required, error, fieldHelp, customClassContainer, customClassLabel }}>
        <textarea
          ref={ref}
          id={inputId}
          name={name}
          required={required}
          rows={rows}
          aria-invalid={!!error || undefined}
          className={cn(fieldControlClass, 'py-3', error && fieldErrorClass, customClassInput, className)}
          {...rest}
        />
      </Field>
    );
  },
);
TextareaInput.displayName = 'TextareaInput';

// Pays proposés en premier dans le sélecteur de téléphone (origines des étudiants)
const preferredPhoneCountries = ['bf', 'ci', 'sn', 'ml', 'cm', 'bj', 'tg', 'ne', 'gn', 'td', 'ga', 'cg', 'cd'];

type InputPhoneProps = FieldProps & {
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  // Valeur au format E.164 (+22670000000)
  value?: string;
  defaultCountry?: string;
  onChange: (e164: string, country: CountryData) => void;
  onBlur?: () => void;
};

// Téléphone / WhatsApp, toujours renvoyé en E.164
export function InputPhone({
  id,
  name,
  label,
  required,
  disabled,
  error,
  fieldHelp,
  customClassContainer,
  customClassInput,
  customClassLabel,
  placeholder = 'Numéro de téléphone',
  value,
  defaultCountry = 'bf',
  onChange,
  onBlur,
}: InputPhoneProps) {
  const inputId = id ?? name;
  return (
    <Field {...{ id: inputId, label, required, error, fieldHelp, customClassContainer, customClassLabel }}>
      <PhoneInput
        country={defaultCountry}
        preferredCountries={preferredPhoneCountries}
        value={value?.replace(/^\+/, '') ?? ''}
        onChange={(digits, country) => onChange(digits ? `+${digits}` : '', country as CountryData)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        countryCodeEditable={false}
        inputProps={{ id: inputId, name, required, 'aria-invalid': !!error || undefined }}
        containerClass="gai2e-phone"
        inputClass={cn(fieldControlClass, 'pl-14!', error && fieldErrorClass, customClassInput)}
        buttonClass="rounded-l-2xl! border-input! bg-transparent!"
        dropdownClass="rounded-xl! shadow-lg!"
        inputStyle={{ width: '100%', height: 'auto' }}
      />
    </Field>
  );
}

type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> & {
  onCheckedChange?: (checked: boolean) => void;
};

export const InputSwitch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => (
    <label className={cn('relative inline-flex cursor-pointer items-center', className)}>
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        className="peer sr-only"
        onChange={(event) => {
          onChange?.(event);
          onCheckedChange?.(event.target.checked);
        }}
        {...props}
      />
      <span className="h-6 w-11 rounded-full bg-input transition-colors peer-checked:bg-primary peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/30 after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:content-[''] peer-checked:after:translate-x-5" />
    </label>
  ),
);
InputSwitch.displayName = 'InputSwitch';

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  showIcon?: boolean;
  containerClassName?: string;
};

export function SearchInput({ showIcon = true, containerClassName, className, ...props }: SearchInputProps) {
  return (
    <div className={cn('relative w-full', containerClassName)}>
      {showIcon && (
        <LuSearch className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
      )}
      <input
        type="search"
        className={cn(
          'h-11 w-full rounded-full border border-transparent bg-muted pr-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-card focus-visible:ring-[3px] focus-visible:ring-ring/30',
          showIcon ? 'pl-10' : 'pl-4',
          className,
        )}
        {...props}
      />
    </div>
  );
}
