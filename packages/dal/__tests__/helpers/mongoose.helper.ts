import mongoose from 'mongoose';

export function clearMongooseModels(): void {
  mongoose.models = {};
}
