import { createZodDto } from 'nestjs-zod';
import { destinationDetailSchema, destinationSummarySchema } from '@gai2e/shared-types';

export class DestinationSummaryDto extends createZodDto(destinationSummarySchema) {}
export class DestinationDetailDto extends createZodDto(destinationDetailSchema) {}
