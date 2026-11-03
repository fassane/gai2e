import { createZodDto } from 'nestjs-zod';
import { siteConfigResponseSchema, siteConfigSchema } from '@gai2e/shared-types';

export class SiteConfigDto extends createZodDto(siteConfigResponseSchema) {}
export class UpdateSiteConfigDto extends createZodDto(siteConfigSchema) {}
