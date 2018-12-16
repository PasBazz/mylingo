import { ILoginErrors, ILoginInputValues, validateLogin, validateLoginByKey, validationErrors, ValidationResult } from '@lingo/validator';

describe('Login verification unit test', () => {
  it('Result of login verification must be positive', () => {
    const state: ILoginInputValues | any = { email: 'user@gmail.com', password: 'qwerty', extrafield: 58 };

    const result = validateLogin(state);

    expect(result.isValid).toBeTruthy();
  });

  it('Result of login verification must be negative because email is empty', () => {
    const state: ILoginInputValues = { email: '', password: 'qwerty' };

    const result: ValidationResult<ILoginErrors> = validateLogin(state);

    expect(result.isValid).toBeFalsy();
    expect(result.errors.email).toBe(validationErrors['email-is-empty']);
    expect(result.errors.password).toBeUndefined();
  });

  it('Result of login verification must be negative because password is empty', () => {
    const state: ILoginInputValues = { email: 'user@gmail.com', password: '' };

    const result = validateLogin(state);

    expect(result.isValid).toBeFalsy();
    expect(result.errors.email).toBeUndefined();
    expect(result.errors.password).toBe(validationErrors['password-is-empty']);
  });

  it('Result of login verification must be negative because password length less than 6 characters', () => {
    const state: ILoginInputValues = { email: 'user@gmail.com', password: 'qwert' };

    const result = validateLogin(state);

    expect(result.isValid).toBeFalsy();
    expect(result.errors.email).toBeUndefined();
    expect(result.errors.password).toBe(validationErrors['password-invalid-length']);
  });

  it.each([['email', { email: 'user@gmail.com' }], ['password', { password: 'qwerty' }]])(
    'Result of the validation the value by key should be positive',
    (key, state) => {
      const result = validateLoginByKey(key, state);

      expect(result.isValid).toBeTruthy();
    }
  );

  it.each([{ email: '' }, { email: undefined }, { email: null }])(
    'Result of the validation the value by key [email] should be negative because it is empty, undefined or null',
    (state) => {
      const result = validateLoginByKey('email', state);

      expect(result.isValid).toBeFalsy();
    }
  );

  it.each([{ password: 'qwert' }, { password: '' }, { password: undefined }, { password: null }])(
    'Result of the validation the value by key [password] should be negative because it is empty, undefined or null',
    (state) => {
      const result = validateLoginByKey('password', state);

      expect(result.isValid).toBeFalsy();
    }
  );
});
