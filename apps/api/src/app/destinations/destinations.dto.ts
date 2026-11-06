import { createZodDto } from 'nestjs-zod';
import {
  adminDestinationDetailSchema,
  adminDestinationSchema,
  createDestinationSchema,
  createProcedureStepSchema,
  destinationDetailSchema,
  destinationSummarySchema,
  documentTypeOptionSchema,
  reorderSchema,
  updateDestinationSchema,
  updateProcedureStepSchema,
} from '@gai2e/shared-types';

export class DestinationSummaryDto extends createZodDto(destinationSummarySchema) {}
export class DestinationDetailDto extends createZodDto(destinationDetailSchema) {}

export class CreateDestinationDto extends createZodDto(createDestinationSchema) {}
export class UpdateDestinationDto extends createZodDto(updateDestinationSchema) {}
export class CreateProcedureStepDto extends createZodDto(createProcedureStepSchema) {}
export class UpdateProcedureStepDto extends createZodDto(updateProcedureStepSchema) {}
export class ReorderDto extends createZodDto(reorderSchema) {}
export class AdminDestinationDto extends createZodDto(adminDestinationSchema) {}
export class AdminDestinationDetailDto extends createZodDto(adminDestinationDetailSchema) {}
export class DocumentTypeOptionDto extends createZodDto(documentTypeOptionSchema) {}
