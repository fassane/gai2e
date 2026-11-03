import { createZodDto } from 'nestjs-zod';
import {
  changePasswordSchema,
  updateProfileSchema,
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
export class UpdateProfileDto extends createZodDto(updateProfileSchema) {}
export class ChangePasswordDto extends createZodDto(changePasswordSchema) {}
export class MessageResponseDto extends createZodDto(messageResponseSchema) {}
