import { SetMetadata } from '@nestjs/common';

export const InvalidateCache: any = () => SetMetadata('invalidateCache', true);

export const Cache: any = () => SetMetadata('shouldUseCache', true);