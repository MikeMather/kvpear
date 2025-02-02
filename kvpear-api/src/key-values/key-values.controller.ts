import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Req, RawBodyRequest, Query, HttpCode } from '@nestjs/common';
import { KeyValuesService } from './key-values.service';
import { ScopedPermissionsGuard } from 'src/middleware/apiKey.gaurd';
import { Permissions } from 'src/middleware/permissions.decorator';
import { ApiPermissions } from 'src/types/permissions';
import { UseEntityInterceptor } from 'src/middleware/useEntity.decorator';
import { RawTextBodyInterceptor } from 'src/middleware/textBody.decorator';
import { FastifyRequest } from 'fastify';
import { formatKvPairs } from 'src/utils/entities';
import { CacheInterceptor } from 'src/middleware/cache.interceptor';
import { Cache, InvalidateCache } from 'src/middleware/cache.decorator';
import { ValidateMongoId } from 'src/utils/validation';

@UseInterceptors(CacheInterceptor)
@UseInterceptors(UseEntityInterceptor)
@UseInterceptors(RawTextBodyInterceptor)
@Controller('kvs')
export class KeyValuesController {
  constructor(private readonly keyValuesService: KeyValuesService) {}

  @Post(':bucketName/:key')
  @HttpCode(201)
  @InvalidateCache()
  @UseGuards(ScopedPermissionsGuard)
  @Permissions(ApiPermissions.WRITE_KEY_VALUE)
  async create(@Param('key') key: string, 
        @Param('bucketName') bucketName: string,
        @Req() req: RawBodyRequest<FastifyRequest>
  ) {
    const value = req.body as string;
    const isIncrement = value.startsWith('+') || value.startsWith('-');
    const query = {
      bucketName,
      userId: req.raw['session'].userId,
      key,
      value
    };
    if (isIncrement) {
      const res = await this.keyValuesService.createOrIncrement(query);
      return res.value;
    }
    const res = await this.keyValuesService.createOrUpdate(query);
    return res.value;
  }

  @Get(':bucketName/:key')
  @Cache()
  @UseGuards(ScopedPermissionsGuard)
  @Permissions(ApiPermissions.READ_KEY_VALUE)
  async findOne(@Param('key') key: string, 
          @Param('bucketName') bucketName: string,
          @Req() req: RawBodyRequest<FastifyRequest>
  ) {
    const val = await this.keyValuesService.read({
      bucketName,
      userId: req.raw['session'].userId,
      key
    });
    return val.value;
  }

  @Get(':bucketName')
  @UseGuards(ScopedPermissionsGuard)
  @Permissions(ApiPermissions.READ_KEY_VALUE)
  async findAll(@Param('bucketName') bucketName: string,
          @Req() req: RawBodyRequest<FastifyRequest>,
          @Query('prefix') prefix: string,
          @Query('regex') regex: string
  ) {
    if (!prefix) {
      if (regex) {
        const unencodedRegex = decodeURIComponent(regex);
        const kvs = await this.keyValuesService.findByRegex({
          bucketName,
          userId: req.raw['session'].userId,
          regex: unencodedRegex
        });
        return formatKvPairs(kvs);
      }
      const kvs = await this.keyValuesService.findAll({
        bucketName,
        userId: req.raw['session'].userId
      });
      return formatKvPairs(kvs);
    }
    const kvs = await this.keyValuesService.findByPrefix({
      bucketName,
      userId: req.raw['session'].userId,
      prefix
    });
    return formatKvPairs(kvs);
  }

  @InvalidateCache()
  @HttpCode(204)
  @InvalidateCache()
  @Delete(':bucketName/:key')
  async remove(@Param('key') key: string, 
        @Param('bucketName') bucketName: string,
        @Req() req: RawBodyRequest<FastifyRequest>
    ) {
    const deleted = await this.keyValuesService.unset({
      bucketName,
      userId: req.raw['session'].userId,
      key
    });
  }
}
