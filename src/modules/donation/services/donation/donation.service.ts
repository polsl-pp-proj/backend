import { Inject, Injectable } from '@nestjs/common';
import { PrepareProjectDonationDto } from '../../dtos/prepare-project-donation.dto';
import { ProjectDonationRepository } from '../../repositories/project-donation.repository';
import Stripe from 'stripe';
import { checkForeignKeyViolation } from 'src/helpers/check-foreign-key-violation.helper';

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
                const projectDonationRepository = new ProjectDonationRepository(
                    manager.connection,
                    manager,
                );

                const projectDonation = projectDonationRepository.create({
                    user: { id: userId },
                    userId,
                    projectId,
                    // project: { id: projectId },
                    amount: prepareProjectDonationDto.amount,
                    isAnonymous: prepareProjectDonationDto.isAnonymous,
                    paymentFinished: false,
                    paymentIntentId: 'TBF',
                });

                try {
                    await projectDonationRepository.save(projectDonation, {
                        reload: true,
                    });
                } catch (ex) {
                    checkForeignKeyViolation(ex, 'project_does_not_exist');
                    throw ex;
                }

                const paymentIntent = await this.stripe.paymentIntents.create({
                    amount: prepareProjectDonationDto.amount * 100,
                    currency: 'pln',
                });

                await projectDonationRepository.save(
                    {
                        id: projectDonation.id,
                        paymentIntentId: paymentIntent.id,
                    },
                    {
                        reload: true,
                    },
                );

                return paymentIntent.client_secret;
            },
        );
    }
}
