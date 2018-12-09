import { IError } from '../models';

export interface IRegisterInputValues {
  name?: string;
  email?: string;
  password?: string;
}

export interface IRegisterErrors {
  name?: IError;
  email?: IError;
  password?: IError;
  errorMessage?: string | undefined;
}
