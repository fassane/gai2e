import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@gai2e/db';
import type { DestinationDetail, DestinationSummary } from '@gai2e/shared-types';

// Fiches publiques des destinations : seules les destinations et les étapes actives sont exposées.
@Injectable()
export class DestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<DestinationSummary[]> {
    const destinations = await this.prisma.destination.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { stepTemplates: { where: { isActive: true } } } } },
    });
    return destinations.map((destination) => ({
      countryCode: destination.countryCode,
      slug: destination.slug,
      name: destination.name,
      summary: destination.summary,
      stepCount: destination._count.stepTemplates,
    }));
  }

  async get(slug: string): Promise<DestinationDetail> {
    const destination = await this.prisma.destination.findFirst({
      where: { slug, isActive: true },
      include: {
        stepTemplates: {
          where: { isActive: true },
          orderBy: { position: 'asc' },
          include: { requiredDocumentTypes: { orderBy: [{ displayOrder: 'asc' }, { label: 'asc' }] } },
        },
      },
    });
    if (!destination) throw new NotFoundException('Destination introuvable');

    const steps = destination.stepTemplates.map((step) => ({
      code: step.code,
      title: step.title,
      description: step.description,
      category: step.category,
      dueDaysBeforeIntake: step.defaultDueDaysBeforeIntake,
      isOptional: step.isOptional,
      externalUrl: step.externalUrl,
      documents: step.requiredDocumentTypes.map(({ code, label }) => ({ code, label })),
    }));
    const documents = new Map(steps.flatMap((step) => step.documents).map((document) => [document.code, document]));

    return {
      countryCode: destination.countryCode,
      slug: destination.slug,
      name: destination.name,
      summary: destination.summary,
      stepCount: steps.length,
      steps,
      documents: [...documents.values()],
    };
  }
}
