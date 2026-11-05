import { BadRequestException, Injectable } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { PrismaService } from '@gai2e/db';
import { legalPageHasText, type LegalPage, type LegalPageId } from '@gai2e/shared-types';

// Le contenu est affiché tel quel sur le site : seule la mise en forme de l'éditeur est conservée
const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: ['h2', 'h3', 'p', 'br', 'ul', 'ol', 'li', 'strong', 'em', 'u', 'blockquote', 'a'],
  allowedAttributes: { a: ['href', 'target', 'rel'] },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
  },
};

@Injectable()
export class LegalPagesService {
  constructor(private readonly prisma: PrismaService) {}

  async get(id: LegalPageId): Promise<LegalPage> {
    const row = await this.prisma.legalPage.findUnique({ where: { id } });
    return { id, content: row?.content ?? null, updatedAt: row?.updatedAt.toISOString() ?? null };
  }

  async update(id: LegalPageId, content: string, userId: string): Promise<LegalPage> {
    const clean = sanitizeHtml(content, sanitizeOptions);
    if (!legalPageHasText(clean)) throw new BadRequestException('Le contenu ne peut pas être vide');
    const row = await this.prisma.legalPage.upsert({
      where: { id },
      create: { id, content: clean, updatedById: userId },
      update: { content: clean, updatedById: userId },
    });
    return { id, content: row.content, updatedAt: row.updatedAt.toISOString() };
  }
}
