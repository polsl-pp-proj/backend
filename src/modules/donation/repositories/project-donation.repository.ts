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
}
