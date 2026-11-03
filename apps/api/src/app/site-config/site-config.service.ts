import { Injectable } from '@nestjs/common';
import { PrismaService, type SiteConfig as SiteConfigRow } from '@gai2e/db';
import { brandOf, defaultSiteConfig, type Brand, type SiteConfig, type SiteConfigInput } from '@gai2e/shared-types';

// Ligne unique de la table SiteConfig
const SITE_CONFIG_ID = 'default';

// Réglages du site (Configuration du back-office). Sans ligne enregistrée, les valeurs par défaut s'appliquent.
@Injectable()
export class SiteConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<SiteConfig> {
    const row = await this.prisma.siteConfig.findUnique({ where: { id: SITE_CONFIG_ID } });
    return row ? toSiteConfig(row) : defaultSiteConfig;
  }

  async update(input: SiteConfigInput, userId: string): Promise<SiteConfig> {
    const data = { ...input, updatedById: userId };
    const row = await this.prisma.siteConfig.upsert({
      where: { id: SITE_CONFIG_ID },
      create: { id: SITE_CONFIG_ID, ...data },
      update: data,
    });
    return toSiteConfig(row);
  }

  // Coordonnées pour les emails (pied de page)
  async brand(): Promise<Brand> {
    return brandOf(await this.get());
  }
}

function toSiteConfig(row: SiteConfigRow): SiteConfig {
  return {
    description: row.description,
    contactEmail: row.contactEmail,
    whatsappPhone: row.whatsappPhone,
    phone: row.phone,
    address: row.address,
    openingHours: row.openingHours,
    facebookUrl: row.facebookUrl,
    instagramUrl: row.instagramUrl,
    linkedinUrl: row.linkedinUrl,
    tiktokUrl: row.tiktokUrl,
    youtubeUrl: row.youtubeUrl,
    xUrl: row.xUrl,
    updatedAt: row.updatedAt.toISOString(),
  };
}
