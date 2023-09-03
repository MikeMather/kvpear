import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiKeysService } from 'src/api-keys/api-keys.service';
import { isAuthExempt } from 'src/utils/auth';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  async use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: NextFunction) {
    const apiKey = req.headers['x-api-key'] as string;

    const skipAuth = isAuthExempt(req);
  
    if (skipAuth) {
      // @ts-ignore
      if (req.originalUrl === '/health') {
        return res.end(JSON.stringify({ message: 'OK' }));
      }
      return next();
    }

    if (!apiKey) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ message: 'No API key provided' }));
    }

    const apiKeyInfo = await this.apiKeysService.getApiKeyInfo(apiKey);
    if (!apiKeyInfo) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ message: 'Invalid API key' }))
    }

    if (!!apiKeyInfo.lockedDomains.length) {
      res.setHeader('Access-Control-Allow-Origin', apiKeyInfo.lockedDomains.join(','));
    }

    // Attach apiKeyInfo to the request for use in guards and controllers
    req['session'] = apiKeyInfo;

    // @ts-ignore
    const path: string = req.originalUrl;
    const cacheKey = `${apiKeyInfo.userId}:path:${path}`;
    req['cacheKey'] = cacheKey;
    next();
  }
}