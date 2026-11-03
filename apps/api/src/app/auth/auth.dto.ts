import { createZodDto } from 'nestjs-zod';
import {
  authSessionSchema,
  authUserSchema,
  forgotPasswordSchema,
  loginSchema,
  messageResponseSchema,
  resetPasswordSchema,
} from '@gai2e/shared-types';

export class LoginDto extends createZodDto(loginSchema) {}
export class ForgotPasswordDto extends createZodDto(forgotPasswordSchema) {}
export class ResetPasswordDto extends createZodDto(resetPasswordSchema) {}
export class AuthUserDto extends createZodDto(authUserSchema) {}
export class AuthSessionDto extends createZodDto(authSessionSchema) {}
export class MessageResponseDto extends createZodDto(messageResponseSchema) {}
