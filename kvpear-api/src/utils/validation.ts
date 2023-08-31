import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import {ObjectId} from 'mongodb'

export const isUrlSafe = (str: string): boolean => {
  return /^[a-zA-Z0-9-_]+$/.test(str);
}

@Injectable()
export class ValidateMongoId implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string{ // Optional casting into ObjectId if wanted!
      if(ObjectId.isValid(value)){
          if((String)(new ObjectId(value)) === value)
              return value;        
          throw new BadRequestException("Invalid id")
      }
      throw new BadRequestException("Invalid id")
  };
}