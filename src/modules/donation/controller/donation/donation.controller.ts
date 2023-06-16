import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { AuthTokenPayload } from 'src/modules/auth/decorators/param/user.decorator';
import { AuthTokenPayloadDto } from 'src/modules/auth/dtos/auth-token-payload.dto';
import { AuthTokenGuard } from 'src/modules/auth/guards/auth-token.guard';
import { DonationService } from '../../services/donation/donation.service';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { validationConfig } from 'src/configs/validation.config';
import { PrepareProjectDonationDto } from '../../dtos/prepare-project-donation.dto';
import { ForeignKeyConstraintViolationException } from 'src/exceptions/foreign-key-constraint-violation.exception';
import { StripeEvent } from 'src/decorators/param/stripe-event.decorator';
import { StripeWebhookGuard } from 'src/modules/auth/guards/stripe-webhook.guard';
import Stripe from 'stripe';
import { PreparedProjectDonationDto } from '../../dtos/prepared-project-donation.dto';

@Controller({ path: 'donation', version: '1' })
export class DonationController {
    constructor(private readonly donationService: DonationService) {}

    @Post('webhook')
    @UseGuards(StripeWebhookGuard)
    async webhookEvent(@StripeEvent() event: Stripe.Event) {
        try {
            switch (event.type) {
                case 'payment_intent.succeeded': {
                    await this.donationService.paymentIntentSucceeded(event);
                    break;
                }
            }
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
    }

    @Post(':projectId')
    @UseGuards(AuthTokenGuard)
    async prepareProjectDonation(
        @AuthTokenPayload() user: AuthTokenPayloadDto,
        @Param('projectId', ParseIntPipe) projectId: number,
        @Body(new ValidationPipe(validationConfig))
        prepareProjectDonationDto: PrepareProjectDonationDto,
    ) {
        try {
            return new PreparedProjectDonationDto({
                clientSecret: await this.donationService.prepareProjectDonation(
                    user.userId,
                    projectId,
                    prepareProjectDonationDto,
                ),
            });
        } catch (ex) {
            if (
                ex instanceof RecordNotFoundException ||
                ex instanceof ForeignKeyConstraintViolationException
            ) {
                throw new NotFoundException(ex.message);
            }
            throw ex;
        }
    }

    @Get(':projectId/stats')
    async getProjectDonationStats(
        @Param('projectId', ParseIntPipe) projectId: number,
    ) {
        return await this.donationService.getProjectDonationStats(projectId);
    }
}
