import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ProjectDonation } from '../entities/project-donation.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';

@Injectable()
export class ProjectDonationRepository extends Repository<ProjectDonation> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly entityManager?: EntityManager,
    ) {
        super(
            ProjectDonation,
            entityManager ?? dataSource.createEntityManager(),
        );
    }

    async setDonationPaymentFinished(paymentIntentId: string) {
        await this.manager.transaction(async (manager) => {
            const projectDonationRepository = new ProjectDonationRepository(
                manager.connection,
                manager,
            );

            const updateResult = await projectDonationRepository.update(
                { paymentIntentId },
                { paymentFinished: true },
            );
            if (updateResult.affected === 0) {
                throw new RecordNotFoundException(
                    'payment_intent_does_not_exist',
                );
            }
        });
    }

    async getLastFunders(projectId: number) {
        return await this.find({
            where: { projectId, paymentFinished: true },
            relations: { user: true },
            take: 10,
            order: { createdAt: 'DESC' },
        });
    }

    async getDonationStats(projectId: number) {
        return await this.manager.transaction(async (manager) => {
            const completedPaymentRepository = new ProjectDonationRepository(
                manager.connection,
                manager,
            );

            const funders = await completedPaymentRepository.getLastFunders(
                projectId,
            );

            const raisedLastMonth = (
                await completedPaymentRepository
                    .createQueryBuilder('payment')
                    .select('COALESCE(SUM(payment.amount), 0) as "amount"')
                    .where('payment.projectId = :projectId', { projectId })
                    .andWhere('payment.createdAt >= :date', {
                        date: new Date(new Date().valueOf() - 2678400000),
                    })
                    .andWhere('payment.paymentFinished = TRUE')
                    .getRawOne<{ amount: number }>()
            ).amount;

            const raisedAllTime = (
                await completedPaymentRepository
                    .createQueryBuilder('payment')
                    .select('COALESCE(SUM(payment.amount), 0) as "amount"')
                    .where('payment.projectId = :projectId', { projectId })
                    .andWhere('payment.paymentFinished = TRUE')
                    .getRawOne<{ amount: number }>()
            ).amount;

            return { funders, raisedLastMonth, raisedAllTime };
        });
    }
}
