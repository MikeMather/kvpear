import { NotFoundException } from "@nestjs/common";

export enum ErrorCodes {
  DUPLICATE_KEY_ERROR = 11000
}

export const existsOr404 = (resource: any, message: string) => {
  if (!resource) {
    throw new NotFoundException(message);
  }
  return resource;
};