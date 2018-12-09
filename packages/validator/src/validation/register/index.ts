import { verifyOnEmptyOrLength, verifyOnValidEmail } from '../common.functions';
import { validationErrors } from '../errors';
import { IError, ValidationResult } from '../models';
import { IRegisterErrors, IRegisterInputValues } from './interfaces';

const defaulState: IRegisterInputValues = { name: '', email: '', password: '' };

export function validateRegisterByKey(key: keyof IRegisterInputValues, state: IRegisterInputValues): ValidationResult<IRegisterErrors> {
  const errors: IRegisterErrors = {};

  errors[key] = verifyStateByKey(key, state);

  return new ValidationResult<IRegisterErrors>(errors);
}

export function validateRegister(state: IRegisterInputValues): ValidationResult<IRegisterErrors> {
  const errors: IRegisterErrors = {};

  for (const value of Object.keys(defaulState)) {
    const key = value as keyof IRegisterInputValues;

    errors[key] = verifyStateByKey(key, state);
  }

  return new ValidationResult<IRegisterErrors>(errors);
}

function verifyStateByKey(key: keyof IRegisterInputValues, state: IRegisterInputValues): IError | undefined {
  switch (key) {
    case 'name':
      return verifyOnEmptyOrLength(state[key], validationErrors['name-is-empty'], validationErrors['name-invalid-length'], {
        max: 30,
        min: 2,
      });

    case 'email':
      return verifyOnValidEmail(state[key]);

    case 'password':
      return verifyOnEmptyOrLength(state[key], validationErrors['password-is-empty'], validationErrors['password-invalid-length'], {
        min: 6,
      });
  }
}
