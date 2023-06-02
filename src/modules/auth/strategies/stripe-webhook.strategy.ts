import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Stripe } from 'stripe';
import { Request } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class StripeWebhookStrategy extends PassportStrategy(
    Strategy,
    'stripe-webhook',
) {
    constructor(@Inject('STRIPE') private readonly stripe: Stripe) {
        super();
    }

    async validate(request: Request) {
        if (request.headers.hasOwnProperty('stripe-signature')) {
            try {
                const event: Stripe.Event =
                    await this.stripe.webhooks.constructEventAsync(
                        // @ts-expect-error rawBody exists on request only after middleware sets it
                        request.rawBody,
                        <string>request.headers['stripe-signature'],
                        process.env.STRIPE_WEBHOOK_SECRET_KEY,
                    );

                // @ts-expect-error stripeEvent does not exist on request yet
                request.stripeEvent = event;

                return true;
            } catch (ex) {} //ex instanceof Stripe.errors.StripeSignatureVerificationError;
        }
        throw new UnauthorizedException();
    }
}
