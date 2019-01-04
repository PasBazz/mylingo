import mongoose, { Types } from 'mongoose';
import { IBaseModel, IEntity } from './base.model';

export interface IProfileDto {
  user: mongoose.Schema.Types.ObjectId;
  avatar: string;
  date: Date;
}

export interface IProfile extends IEntity {
  user: Types.ObjectId;
  avatar?: string;
  date?: Date;
  isActivated?: boolean;
  activateToken?: string;
}

export interface IProfileModel extends IBaseModel, IProfile {}

export const ProfileModelSchema = new mongoose.Schema({
  user: {
    ref: 'users',
    type: mongoose.Schema.Types.ObjectId,
  },

  avatar: {
    type: String,
  },

  date: {
    default: Date.now,
    type: Date,
  },

  isActivated: {
    default: false,
    type: Boolean,
  },

  activateToken: {
    type: String,
  },
});
