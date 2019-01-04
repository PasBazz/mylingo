import { IBaseModel, IProfileModel, IUserModel, ModelType, ProfileModelSchema, UserModelSchema } from '@lingo/domain-model';
import { injectable } from 'inversify';
import mongoose, { Mongoose } from 'mongoose';
import 'reflect-metadata';
import { IEntityContext } from './IEntityContext';

@injectable()
export class EntityContext implements IEntityContext {
  private _mongoose: Mongoose = mongoose;

  public connect(path: string, isDebug: boolean): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      try {
        this.init(isDebug);

        this._mongoose = await mongoose.connect(
          path,
          { useNewUrlParser: true, autoReconnect: true, keepAlive: 30000 }
        );

        this.registerModels();

        resolve(true);
      } catch (error) {
        resolve(false);
      }
    });
  }

  public disconnect(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      try {
        this._mongoose.disconnect();

        resolve(true);
      } catch (error) {
        resolve(false);
      }
    });
  }

  public getModel<T extends IBaseModel>(type: ModelType): mongoose.Model<T> | undefined {
    const model = this._mongoose.models[type as string];

    return model as mongoose.Model<T>;
  }

  private init(isDebug: boolean) {
    mongoose.Promise = Promise;
    mongoose.set('debug', isDebug);
  }

  private registerModels() {
    this.register<IUserModel>('users', UserModelSchema);
    this.register<IProfileModel>('profiles', ProfileModelSchema);
  }

  private register<T extends IBaseModel>(type: ModelType, schema: any): void {
    this._mongoose.model<T>(type as string, schema);
  }
}
