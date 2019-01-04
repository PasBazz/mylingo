import { IBaseModel, ModelType } from '@lingo/domain-model';
import mongoose from 'mongoose';

export interface IEntityContext {
  connect(path: string, isDebug: boolean): Promise<boolean>;
  disconnect(): Promise<boolean>;

  getModel<T extends IBaseModel>(type: ModelType): mongoose.Model<T> | undefined;
}
