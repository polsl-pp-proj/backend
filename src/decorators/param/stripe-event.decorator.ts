import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Stripe } from 'stripe';

export const StripeEvent = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return <Stripe.Event>request.stripeEvent;
    },
);
