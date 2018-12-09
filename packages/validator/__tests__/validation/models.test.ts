import { IError, ValidationResult } from '@lingo/validator';

describe('ValidationResult unit tests', () => {
  it('Validation result must be positive', () => {
    const errors = { value1: undefined, value2: undefined };

    const result = new ValidationResult(errors);

    expect(result.isValid).toBeTruthy();
  });

  it('Validation result must be negative', () => {
    const error: IError = { message: 'error message', code: 'error code' };

    const errors = { value1: undefined, value2: error };

    const result = new ValidationResult(errors);

    expect(result.isValid).toBeFalsy();
  });
});
