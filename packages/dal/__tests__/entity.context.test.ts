import { EntityContext } from '@lingo/dal';
import { IUserModel } from '@lingo/domain-model';

import { clearMongooseModels } from './helpers/mongoose.helper';

describe('Entity context unit tests', () => {
  afterEach(() => {
    clearMongooseModels();
  });

  it('Should connect and disconnect from database successfully', async () => {
    const context = new EntityContext();

    let result = await context.connect(
      (global as any).__MONGO_URI__,
      true
    );

    expect(result).toBeTruthy();

    result = await context.disconnect();

    expect(result).toBeTruthy();
  });

  it('Should connect to database unsuccessfully because the connect path is incorrect ', async () => {
    const context = new EntityContext();

    const result = await context.connect(
      'mongodb://localhost:999',
      true
    );

    expect(result).toBeFalsy();
  });

  it('Should return model successfully', async () => {
    const context = new EntityContext();

    await context.connect(
      (global as any).__MONGO_URI__,
      true
    );

    const model = context.getModel<IUserModel>('users');

    expect(model).not.toBeUndefined();
  });

  it('Should return model unsuccessfully because the context does not have a database connection', async () => {
    const context = new EntityContext();

    const model = context.getModel<IUserModel>('users');

    expect(model).toBeUndefined();
  });
});
