import { Exclude } from "class-transformer";
import { BaseEntity } from "src/utils/entities";

export class BucketEntity extends BaseEntity {
  name: string;

  @Exclude()
  userId: string;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  keyValuePairs: {
    key: string;
    value: string;
  }
}