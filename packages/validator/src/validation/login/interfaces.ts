import { IError } from '../models';

export interface ILoginInputValues {
  email?: string;
  password?: string;
}

export interface ILoginErrors {
  email?: IError;
  password?: IError;
  errorMessage?: string;
}
