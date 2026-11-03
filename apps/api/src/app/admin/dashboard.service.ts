import { Injectable } from '@nestjs/common';
import { DossierStatus, PrismaService, type Prisma } from '@gai2e/db';
import type { Dashboard } from '@gai2e/shared-types';
import type { RequestUser } from '../auth/current-user.decorator';

const activeStatuses: DossierStatus[] = [DossierStatus.SUBMITTED, DossierStatus.IN_PROGRESS, DossierStatus.ON_HOLD];
const dayMs = 24 * 60 * 60 * 1000;

// Indicateurs du back-office. Un administrateur voit tous les dossiers, un conseiller ceux qui lui sont assignés.
@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async get(user: RequestUser): Promise<Dashboard> {
    const mine = user.role !== 'ADMIN';
    const dossierScope: Prisma.DossierWhereInput = mine ? { advisorId: user.id } : {};
    const activeDossier: Prisma.DossierWhereInput = { ...dossierScope, status: { in: activeStatuses } };
    const now = new Date();
    const openStep: Prisma.DossierStepWhereInput = { status: { notIn: ['DONE', 'SKIPPED'] }, dossier: activeDossier };

    const [
      activeDossiers,
      awaitingAssignment,
      documentsToReview,
      overdueSteps,
      newLeads,
      students,
      byStatus,
      byDestination,
      destinations,
      upcomingSteps,
      recentLeads,
    ] = await this.prisma.$transaction([
      this.prisma.dossier.count({ where: activeDossier }),
      // La file d'attente concerne toute l'équipe, conseiller ou non
      this.prisma.dossier.count({ where: { status: DossierStatus.SUBMITTED, advisorId: null } }),
      this.prisma.document.count({
        where: { status: { in: ['UPLOADED', 'IN_REVIEW'] }, deletedAt: null, ...(mine && { dossier: dossierScope }) },
      }),
      this.prisma.dossierStep.count({ where: { ...openStep, dueAt: { lt: now } } }),
      this.prisma.lead.count({ where: { status: 'NEW' } }),
      this.prisma.user.count({
        where: { role: 'STUDENT', isActive: true, ...(mine && { dossiers: { some: dossierScope } }) },
      }),
      this.prisma.dossier.groupBy({
        by: ['status'],
        where: dossierScope,
        _count: { _all: true },
        orderBy: { status: 'asc' },
      }),
      this.prisma.dossier.groupBy({
        by: ['destinationId'],
        where: activeDossier,
        _count: { _all: true },
        orderBy: { destinationId: 'asc' },
      }),
      this.prisma.destination.findMany({
        where: { isActive: true },
        orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
        select: { id: true, countryCode: true, name: true },
      }),
      this.prisma.dossierStep.findMany({
        where: { ...openStep, dueAt: { gte: now, lte: new Date(now.getTime() + 14 * dayMs) } },
        orderBy: { dueAt: 'asc' },
        take: 6,
        select: {
          id: true,
          title: true,
          dueAt: true,
          dossier: {
            select: {
              reference: true,
              student: { select: { firstName: true, lastName: true } },
              destination: { select: { countryCode: true } },
            },
          },
        },
      }),
      this.prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          status: true,
          createdAt: true,
          destination: { select: { name: true, countryCode: true } },
        },
      }),
    ]);

    const countByStatus = new Map(byStatus.map((row) => [row.status, (row._count as { _all: number })._all]));
    const countByDestination = new Map(
      byDestination.map((row) => [row.destinationId, (row._count as { _all: number })._all]),
    );

    return {
      scope: mine ? 'mine' : 'all',
      kpis: { activeDossiers, awaitingAssignment, documentsToReview, overdueSteps, newLeads, students },
      // Ordre du parcours d'un dossier
      dossiersByStatus: Object.values(DossierStatus).map((status) => ({
        status,
        count: countByStatus.get(status) ?? 0,
      })),
      dossiersByDestination: destinations.map((destination) => ({
        countryCode: destination.countryCode,
        name: destination.name,
        count: countByDestination.get(destination.id) ?? 0,
      })),
      upcomingSteps: upcomingSteps.map((step) => ({
        id: step.id,
        title: step.title,
        dueAt: (step.dueAt as Date).toISOString(),
        dossierReference: step.dossier.reference,
        studentName: `${step.dossier.student.firstName} ${step.dossier.student.lastName}`,
        countryCode: step.dossier.destination.countryCode,
      })),
      recentLeads: recentLeads.map((lead) => ({
        id: lead.id,
        name: [lead.firstName, lead.lastName].filter(Boolean).join(' '),
        destination: lead.destination?.name ?? null,
        countryCode: lead.destination?.countryCode ?? null,
        status: lead.status,
        createdAt: lead.createdAt.toISOString(),
      })),
    };
  }
}
