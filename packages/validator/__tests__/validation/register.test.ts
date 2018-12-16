import { IRegisterErrors, IRegisterInputValues, validateRegister, validateRegisterByKey, validationErrors, ValidationResult } from '@lingo/validator';

describe('Unit tests ащк function validateRegister', () => {
  it('Result of the data validation should be positive', () => {
    const state: IRegisterInputValues | any = { name: 'user', email: 'user@gmail.com', password: 'qwerty', extrafield: 58 };

    const result = validateRegister(state);

    expect(result.isValid).toBeTruthy();
  });

  it('Result of the data validation should be negative because name is empty', () => {
    const state: IRegisterInputValues = { name: '', email: 'user@gmail.com', password: 'qwerty' };

    const result: ValidationResult<IRegisterErrors> = validateRegister(state);

    expect(result.isValid).toBeFalsy();
    expect(result.errors.name).toBe(validationErrors['name-is-empty']);
    expect(result.errors.email).toBeUndefined();
    expect(result.errors.password).toBeUndefined();
  });

  it('Result of the data validation should be negative because email is empty', () => {
    const state: IRegisterInputValues = { name: 'user', email: '', password: 'qwerty' };

    const result: ValidationResult<IRegisterErrors> = validateRegister(state);

    expect(result.isValid).toBeFalsy();
    expect(result.errors.name).toBeUndefined();
    expect(result.errors.email).toBe(validationErrors['email-is-empty']);
    expect(result.errors.password).toBeUndefined();
  });

  it('Result of the data validation should be negative because password is empty', () => {
    const state: IRegisterInputValues = { name: 'user', email: 'user@gmail.com', password: '' };

    const result = validateRegister(state);

    expect(result.isValid).toBeFalsy();
    expect(result.errors.name).toBeUndefined();
    expect(result.errors.email).toBeUndefined();
    expect(result.errors.password).toBe(validationErrors['password-is-empty']);
  });

  it('Result of the data validation should be negative because password length less than 6 characters', () => {
    const state: IRegisterInputValues = { name: 'user', email: 'user@gmail.com', password: 'qwert' };

    const result = validateRegister(state);

    expect(result.isValid).toBeFalsy();
    expect(result.errors.name).toBeUndefined();
    expect(result.errors.email).toBeUndefined();
    expect(result.errors.password).toBe(validationErrors['password-invalid-length']);
  });

  it.each([['name', { name: 'user' }], ['email', { email: 'user@gmail.com' }], ['password', { password: 'qwerty' }]])(
    'Result of the validation the value by key should be positive',
    (key, state) => {
      const result = validateRegisterByKey(key, state);

      expect(result.isValid).toBeTruthy();
    }
  );

  it.each([{ name: '' }, { name: undefined }, { name: null }])(
    'Result of the validation the value by key [name] should be negative because it is empty, undefined or null',
    (state) => {
      const result = validateRegisterByKey('name', state);

      expect(result.isValid).toBeFalsy();
    }
  );

  it.each([{ email: '' }, { email: undefined }, { email: null }])(
    'Result of the validation the value by key [email] should be negative because it is empty, undefined or null',
    (state) => {
      const result = validateRegisterByKey('email', state);

      expect(result.isValid).toBeFalsy();
    }
  );

  it.each([{ password: 'qwert' }, { password: '' }, { password: undefined }, { password: null }])(
    'Result of the validation the value by key [password] should be negative because it is empty, undefined or null',
    (state) => {
      const result = validateRegisterByKey('password', state);

      expect(result.isValid).toBeFalsy();
    }
  );
});
