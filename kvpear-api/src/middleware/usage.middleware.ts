import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { FastifyReply, FastifyRequest } from 'fastify';
import { BillingService } from 'src/billing/billing.service';

@Injectable()
export class UsageMiddleware implements NestMiddleware {
  constructor(private readonly billingService: BillingService) {}

  async use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: NextFunction) {
    const session = req['session'];
    if (session.userId) {
      await this.billingService.incrementUsage(session.userId);
    };
    next();
  }
}