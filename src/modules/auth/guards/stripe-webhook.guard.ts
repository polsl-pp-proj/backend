import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class StripeWebhookGuard extends AuthGuard('stripe-webhook') {}
