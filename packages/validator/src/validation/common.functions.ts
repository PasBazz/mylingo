import validator from 'validator';
import { validationErrors } from './errors';
import { IError } from './models';

export function verifyOnEmpty(value: string | null | undefined, message: string): string | undefined {
  if (value === null || value === undefined || validator.isEmpty(value)) {
    return message;
  }

  return undefined;
}

export function verifyOnEmptyOrLength(
  value: string | null | undefined,
  emptyError: IError,
  lengthError: IError,
  options: { min: number; max?: number }
): IError | undefined {
  if (value === null || value === undefined || validator.isEmpty(value)) {
    return emptyError;
  }

  if (!validator.isLength(value, options)) {
    return lengthError;
  }

  return undefined;
}

export function verifyOnValidEmail(value: string | null | undefined): IError | undefined {
  if (value === null || value === undefined || validator.isEmpty(value)) {
    return validationErrors['email-is-empty'];
  }

  if (!validator.isEmail(value)) {
    return validationErrors['invalid-email'];
  }

  return undefined;
}

export function verifyOnValidUrl(value: string | null | undefined): IError | undefined {
  if (value === null || value === undefined || validator.isEmpty(value)) {
    return validationErrors['invalid-url'];
  }

  return undefined;
}
