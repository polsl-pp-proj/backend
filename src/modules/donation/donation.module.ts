import { Module } from '@nestjs/common';
import { DonationService } from './services/donation/donation.service';
import { DonationController } from './controller/donation/donation.controller';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
    providers: [
        DonationService,
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
})
export class DonationModule {}
