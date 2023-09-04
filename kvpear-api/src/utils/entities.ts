import { Exclude, instanceToPlain } from "class-transformer";
import * as mongoose from "mongoose";

export class BaseEntity {
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  __v: number;

  @Exclude()
  _id: mongoose.Schema.Types.ObjectId;

  constructor(partial: Partial<BaseEntity>) {
    Object.assign(this, partial);
  }
}

export const Serializable = (entity: typeof BaseEntity): (schema: mongoose.Schema) => mongoose.Schema => {
  return (schema: mongoose.Schema): any => {
    schema.methods.serialize = function () {
      const obj = this.toObject();
      obj.id = this._id.toString();
      return instanceToPlain(new entity(obj));
    };
    return schema;
  }
}

export const formatKvPairs = (keyValuePairs: any[]) => {
  if (!keyValuePairs) {
    return [];
  }
  return keyValuePairs.map(kv => ({
    key: kv.key,
    value: kv.value,
  }));
}