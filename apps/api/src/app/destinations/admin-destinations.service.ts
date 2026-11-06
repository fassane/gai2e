import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService, type Prisma } from '@gai2e/db';
import {
  slugify,
  type AdminDestination,
  type AdminDestinationDetail,
  type AdminProcedureStep,
  type CreateDestinationInput,
  type CreateProcedureStepInput,
  type DocumentTypeOption,
  type UpdateDestinationInput,
  type UpdateProcedureStepInput,
} from '@gai2e/shared-types';

const stepInclude = {
  requiredDocumentTypes: { orderBy: [{ displayOrder: 'asc' }, { label: 'asc' }] },
} satisfies Prisma.ProcedureStepTemplateInclude;

type StepRow = Prisma.ProcedureStepTemplateGetPayload<{ include: typeof stepInclude }>;

const activeStepCount = { _count: { select: { stepTemplates: { where: { isActive: true } } } } };

// Gestion des destinations et de leurs procédures par les administrateurs.
// Pas de suppression : on désactive (la fiche et l'étape disparaissent du site, l'historique reste).
// Les dossiers ouverts gardent leur copie des étapes : ces modifications ne les changent pas.
@Injectable()
export class AdminDestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<AdminDestination[]> {
    const destinations = await this.prisma.destination.findMany({
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
      include: activeStepCount,
    });
    return destinations.map((destination) => toAdminDestination(destination, destination._count.stepTemplates));
  }

  async get(id: string): Promise<AdminDestinationDetail> {
    const destination = await this.prisma.destination.findUnique({
      where: { id },
      include: { stepTemplates: { orderBy: { position: 'asc' }, include: stepInclude } },
    });
    if (!destination) throw new NotFoundException('Destination introuvable');
    return {
      ...toAdminDestination(destination, destination.stepTemplates.filter((step) => step.isActive).length),
      steps: destination.stepTemplates.map(toAdminStep),
    };
  }

  async create(input: CreateDestinationInput): Promise<AdminDestination> {
    const slug = slugify(input.name);
    if (!slug) throw new BadRequestException('Ce nom ne permet pas de créer une adresse de fiche');
    const existing = await this.prisma.destination.findFirst({
      where: { OR: [{ countryCode: input.countryCode }, { slug }] },
    });
    if (existing) throw new ConflictException(`Cette destination existe déjà : ${existing.name}`);

    const { _max } = await this.prisma.destination.aggregate({ _max: { displayOrder: true } });
    const destination = await this.prisma.destination.create({
      data: { ...input, slug, displayOrder: (_max.displayOrder ?? -1) + 1 },
    });
    return toAdminDestination(destination, 0);
  }

  async update(id: string, input: UpdateDestinationInput): Promise<AdminDestination> {
    await this.findDestination(id);
    const destination = await this.prisma.destination.update({ where: { id }, data: input, include: activeStepCount });
    return toAdminDestination(destination, destination._count.stepTemplates);
  }

  async reorder(ids: string[]): Promise<void> {
    const existing = await this.prisma.destination.findMany({ select: { id: true } });
    assertSameIds(
      existing.map(({ id }) => id),
      ids,
    );
    await this.prisma.$transaction(
      ids.map((id, displayOrder) => this.prisma.destination.update({ where: { id }, data: { displayOrder } })),
    );
  }

  async createStep(destinationId: string, input: CreateProcedureStepInput): Promise<AdminProcedureStep> {
    await this.findDestination(destinationId);
    const { documentTypeCodes, dueDaysBeforeIntake, ...fields } = input;
    await this.assertDocumentTypes(documentTypeCodes);

    const siblings = await this.prisma.procedureStepTemplate.findMany({
      where: { destinationId },
      select: { code: true, position: true },
    });
    const step = await this.prisma.procedureStepTemplate.create({
      data: {
        ...fields,
        destinationId,
        code: uniqueCode(
          fields.title,
          siblings.map(({ code }) => code),
        ),
        position: Math.max(-1, ...siblings.map(({ position }) => position)) + 1,
        defaultDueDaysBeforeIntake: dueDaysBeforeIntake,
        requiredDocumentTypes: { connect: documentTypeCodes.map((code) => ({ code })) },
      },
      include: stepInclude,
    });
    return toAdminStep(step);
  }

  async updateStep(
    destinationId: string,
    stepId: string,
    input: UpdateProcedureStepInput,
  ): Promise<AdminProcedureStep> {
    await this.findStep(destinationId, stepId);
    const { documentTypeCodes, dueDaysBeforeIntake, ...fields } = input;
    if (documentTypeCodes) await this.assertDocumentTypes(documentTypeCodes);

    const step = await this.prisma.procedureStepTemplate.update({
      where: { id: stepId },
      data: {
        ...fields,
        ...(dueDaysBeforeIntake !== undefined && { defaultDueDaysBeforeIntake: dueDaysBeforeIntake }),
        ...(documentTypeCodes && { requiredDocumentTypes: { set: documentTypeCodes.map((code) => ({ code })) } }),
      },
      include: stepInclude,
    });
    return toAdminStep(step);
  }

  async reorderSteps(destinationId: string, ids: string[]): Promise<void> {
    await this.findDestination(destinationId);
    const existing = await this.prisma.procedureStepTemplate.findMany({
      where: { destinationId },
      select: { id: true },
    });
    assertSameIds(
      existing.map(({ id }) => id),
      ids,
    );
    await this.prisma.$transaction(
      ids.map((id, position) => this.prisma.procedureStepTemplate.update({ where: { id }, data: { position } })),
    );
  }

  async listDocumentTypes(): Promise<DocumentTypeOption[]> {
    return this.prisma.documentType.findMany({
      orderBy: [{ displayOrder: 'asc' }, { label: 'asc' }],
      select: { code: true, label: true },
    });
  }

  private async findDestination(id: string) {
    const destination = await this.prisma.destination.findUnique({ where: { id } });
    if (!destination) throw new NotFoundException('Destination introuvable');
    return destination;
  }

  private async findStep(destinationId: string, stepId: string) {
    const step = await this.prisma.procedureStepTemplate.findFirst({ where: { id: stepId, destinationId } });
    if (!step) throw new NotFoundException('Étape introuvable');
    return step;
  }

  private async assertDocumentTypes(codes: string[]) {
    const known = await this.prisma.documentType.count({ where: { code: { in: codes } } });
    if (known !== new Set(codes).size) throw new BadRequestException('Type de pièce inconnu');
  }
}

// Un réordonnancement doit citer chaque élément exactement une fois
function assertSameIds(existing: string[], ids: string[]) {
  const unique = new Set(ids);
  if (unique.size !== ids.length || unique.size !== existing.length || existing.some((id) => !unique.has(id))) {
    throw new BadRequestException('Liste incomplète : rechargez la page et réessayez');
  }
}

// Code stable de l'étape au sein de la destination : préparer-le-visa, puis preparer-le-visa-2...
function uniqueCode(title: string, taken: string[]) {
  const base = slugify(title) || 'etape';
  if (!taken.includes(base)) return base;
  let suffix = 2;
  while (taken.includes(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

function toAdminDestination(
  destination: {
    id: string;
    countryCode: string;
    slug: string;
    name: string;
    currency: string;
    summary: string | null;
    isActive: boolean;
    updatedAt: Date;
  },
  activeSteps: number,
): AdminDestination {
  return {
    id: destination.id,
    countryCode: destination.countryCode,
    slug: destination.slug,
    name: destination.name,
    currency: destination.currency,
    summary: destination.summary,
    isActive: destination.isActive,
    activeStepCount: activeSteps,
    updatedAt: destination.updatedAt.toISOString(),
  };
}

function toAdminStep(step: StepRow): AdminProcedureStep {
  return {
    id: step.id,
    code: step.code,
    title: step.title,
    description: step.description,
    category: step.category,
    dueDaysBeforeIntake: step.defaultDueDaysBeforeIntake,
    isOptional: step.isOptional,
    externalUrl: step.externalUrl,
    isActive: step.isActive,
    documents: step.requiredDocumentTypes.map(({ code, label }) => ({ code, label })),
  };
}
