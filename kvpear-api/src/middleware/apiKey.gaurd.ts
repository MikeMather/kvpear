import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

@Injectable()
export class ScopedPermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true; // No permissions required for this route
    }

    const request: FastifyRequest = context.switchToHttp().getRequest();
    const apiKeyInfo = request.raw['session']

    if (!apiKeyInfo) {
      return false;
    }

    const hasRequiredPermissions = requiredPermissions.every(permission =>
      apiKeyInfo.permissions.includes(permission),
    );

    if (!hasRequiredPermissions) {
      return false;
    }

    if (!!apiKeyInfo.bucketIds.length) {
      // Check if the apiKeyInfo.bucketId matches the requested bucket
      const requestedBucketId = request.params['bucketId'];
      if (apiKeyInfo.bucketIds.indexOf(requestedBucketId) === -1) {
        return false;
      }
    }
    return true;
  }
}
