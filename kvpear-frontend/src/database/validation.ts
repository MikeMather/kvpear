import mongoose from "mongoose";

export const isObjectId = (id: string) => {
  return mongoose.Types.ObjectId.isValid(id);
}