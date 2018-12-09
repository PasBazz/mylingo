import { verifyOnEmptyOrLength, verifyOnValidEmail } from '../common.functions';
import { validationErrors } from '../errors';
import { IError, ValidationResult } from '../models';
import { ILoginErrors, ILoginInputValues } from './interfaces';

const defaulState: ILoginInputValues = { email: '', password: '' };

export function validateLoginByKey(key: keyof ILoginInputValues, state: ILoginInputValues): ValidationResult<ILoginErrors> {
  const errors: ILoginErrors = {};

  errors[key] = verifyStateByKey(key, state);

  return new ValidationResult<ILoginErrors>(errors);
}

export function validateLogin(state: ILoginInputValues): ValidationResult<ILoginErrors> {
  const errors: ILoginErrors = {};

  for (const value of Object.keys(defaulState)) {
    const key = value as keyof ILoginInputValues;

    errors[key] = verifyStateByKey(key, state);
  }

  return new ValidationResult<ILoginErrors>(errors);
}

function verifyStateByKey(key: keyof ILoginInputValues, state: ILoginInputValues): IError | undefined {
  switch (key) {
    case 'email':
      return verifyOnValidEmail(state[key]);

    case 'password':
      return verifyOnEmptyOrLength(state[key], validationErrors['password-is-empty'], validationErrors['password-invalid-length'], {
        min: 6,
      });
  }
}
