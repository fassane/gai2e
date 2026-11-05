import { createZodDto } from 'nestjs-zod';
import { legalPageSchema, updateLegalPageSchema } from '@gai2e/shared-types';

export class LegalPageDto extends createZodDto(legalPageSchema) {}
export class UpdateLegalPageDto extends createZodDto(updateLegalPageSchema) {}
