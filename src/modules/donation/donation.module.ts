import { Module } from '@nestjs/common';
import { DonationService } from './services/donation/donation.service';
import { DonationController } from './controller/donation/donation.controller';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { ProjectDonationRepository } from './repositories/project-donation.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectDonation } from './entities/project-donation.entity';

dotenv.config();

@Module({
    imports: [TypeOrmModule.forFeature([ProjectDonation])],
    providers: [
        DonationService,
        ProjectDonationRepository,
        {
            provide: 'STRIPE',
            useValue: new Stripe(process.env.STRIPE_SECRET_KEY, {
                apiVersion: '2022-11-15',
                telemetry: false,
                typescript: true,
            }),
        },
    ],
    controllers: [DonationController],
    exports: ['STRIPE'],
})
export class DonationModule {}
