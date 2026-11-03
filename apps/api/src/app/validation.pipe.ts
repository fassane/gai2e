import { BadRequestException } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';

// Valide les DTOs zod (createZodDto) sur @Body / @Query / @Param.
export const Gai2eValidationPipe = createZodValidationPipe({
  createValidationException: (error) =>
    new BadRequestException({
      message: 'Payload invalide',
      issues: (error as ZodError).issues,
    }),
});
