import mongoose from 'mongoose';

import { IBaseModel, IEntity } from './base.model';

export interface IUserDto {
  email: string;
  name: string;
}

export interface IUser extends IEntity {
  email: string;
  name: string;
  password: string;
  resetPasswordHash?: string;
}

export interface IUserModel extends IUser, IBaseModel {}

export const UserModelSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
  },

  name: {
    required: true,
    type: String,
  },

  password: {
    required: true,
    type: String,
  },

  resetPasswordHash: {
    type: String,
  },
});
