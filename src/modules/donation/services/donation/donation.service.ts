import { Inject, Injectable } from '@nestjs/common';
import { PrepareProjectDonationDto } from '../../dtos/prepare-project-donation.dto';
import { ProjectDonationRepository } from '../../repositories/project-donation.repository';
import Stripe from 'stripe';
import { IsNull, Not } from 'typeorm';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { ProjectRepository } from '../../../project/repositories/project.repository';
import { DonationStatsDto } from '../../dtos/donation-stats.dto';
import { convertDonationToFunderDto } from '../../helpers/donation-to-funder.helper';

@Injectable()
export class DonationService {
    constructor(
        @Inject('STRIPE') private readonly stripe: Stripe,
        private readonly projectDonationRepository: ProjectDonationRepository,
    ) {}

    async paymentIntentSucceeded(event: Stripe.Event) {
        const eventData = <Stripe.PaymentIntent>event.data.object;
        await this.projectDonationRepository.setDonationPaymentFinished(
            eventData.id,
        );
    }

    async prepareProjectDonation(
        userId: number,
        projectId: number,
        prepareProjectDonationDto: PrepareProjectDonationDto,
    ) {
        return await this.projectDonationRepository.manager.transaction(
            async (manager) => {
                const projectRepository = new ProjectRepository(
                    manager.connection,
                    manager,
                );
                const projectDonationRepository = new ProjectDonationRepository(
                    manager.connection,
                    manager,
                );

                const project = await projectRepository.findOne({
                    where: { id: projectId, fundingObjectives: Not(IsNull()) },
                    select: { id: true },
                    relations: {},
                });

                if (!project) {
                    throw new RecordNotFoundException(
                        'project_does_not_exist_or_not_fundable',
                    );
                }

                const paymentIntent = await this.stripe.paymentIntents.create({
                    amount: prepareProjectDonationDto.amount * 100,
                    currency: 'pln',
                });

                const projectDonation = projectDonationRepository.create({
                    user: { id: userId },
                    userId,
                    projectId,
                    project: { id: projectId },
                    amount: prepareProjectDonationDto.amount,
                    isAnonymous: prepareProjectDonationDto.isAnonymous,
                    paymentFinished: false,
                    paymentIntentId: paymentIntent.id,
                });

                await projectDonationRepository.save(projectDonation, {
                    reload: true,
                });

                return paymentIntent.client_secret;
            },
        );
    }

    async getProjectDonationStats(projectId: number) {
        const stats = await this.projectDonationRepository.getDonationStats(
            projectId,
        );
        return new DonationStatsDto({
            raised: {
                lastMonth: stats.raisedLastMonth,
                total: stats.raisedAllTime,
            },
            lastFunders: stats.funders.map((donation) =>
                convertDonationToFunderDto(donation),
            ),
        });
    }
}
