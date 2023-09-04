import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, RawBodyRequest, UseInterceptors, BadRequestException, ClassSerializerInterceptor, NotFoundException, HttpCode } from '@nestjs/common';
import { BucketsService } from './buckets.service';
import { ScopedPermissionsGuard } from 'src/middleware/apiKey.gaurd';
import { ApiPermissions } from 'src/types/permissions';
import { Permissions } from 'src/middleware/permissions.decorator';
import { FastifyRequest } from 'fastify';
import { RawTextBodyInterceptor } from 'src/middleware/textBody.decorator';
import { ValidateMongoId, isUrlSafe } from 'src/utils/validation';
import { ErrorCodes } from 'src/utils/errors';
import { UseEntityInterceptor } from 'src/middleware/useEntity.decorator';

@UseInterceptors(UseEntityInterceptor)
@UseInterceptors(RawTextBodyInterceptor)
@Controller('buckets')
export class BucketsController {
  constructor(private readonly bucketsService: BucketsService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(ScopedPermissionsGuard)
  @Permissions(ApiPermissions.CREATE_BUCKET)
  async create(@Req() req: RawBodyRequest<FastifyRequest>) {
    const name = req.body as string;
    if (name) {
      if (!isUrlSafe(name)) {
        throw new BadRequestException('Bucket name must be URL safe');
      }
      try {
        const { userId } = req.raw['session'];
        const newBucket = await this.bucketsService.create(name as string, userId);
        return;
      } catch (err) {
        if (err.code === ErrorCodes.DUPLICATE_KEY_ERROR) {
          throw new BadRequestException('Bucket already exists');
        }
        throw err;
      }
    } else {
      throw new BadRequestException('Bucket name is required');
    }
  }

  @Get()
  @UseGuards(ScopedPermissionsGuard)
  @Permissions(ApiPermissions.LIST_BUCKETS)
  async findAll() {
    return await this.bucketsService.findAll();
  }

  @Get(':name')
  @UseGuards(ScopedPermissionsGuard)
  @Permissions(ApiPermissions.LIST_BUCKETS)
  async findOne(@Param('name') name: string,
                @Req() req: RawBodyRequest<FastifyRequest>) {
    const userId = req.raw['session'].userId;
    const bucket = await this.bucketsService.findOne({ name, userId })
    if (!bucket) {
      throw new NotFoundException('Bucket not found');
    }
    return bucket;
  }

  @Delete(':name')
  @HttpCode(204)
  @UseGuards(ScopedPermissionsGuard)
  @Permissions(ApiPermissions.DELETE_BUCKET)
  async remove(@Param('name') name: string,
                @Req() req: RawBodyRequest<FastifyRequest>) {
    const deleted = await this.bucketsService.remove({
      name,
      userId: req.raw['session'].userId
    });
  }
}
