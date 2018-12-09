import { verifyOnEmpty, verifyOnValidEmail, verifyOnValidUrl } from '../../src/validation/common.functions';
import { validationErrors } from '../../src/validation/errors';

describe('Common functions unit tests', () => {
  it.each([['', 'error message'], [undefined, 'error message'], [null, 'error message']])(
    'Result of function verifyOnEmpty should return an error message',
    (value, message) => {
      const result = verifyOnEmpty(value, message);

      expect(result).toEqual(message);
    }
  );

  it('Result of function verifyOnEmpty should return undefined', () => {
    const result = verifyOnEmpty('q', 'error message');

    expect(result).toBeUndefined();
  });

  it('Result of function verifyOnValidEmail should return undefined', () => {
    const result = verifyOnValidEmail('user@gmail.com');

    expect(result).toBeUndefined();
  });

  it('Result of function verifyOnValidEmail should return an error message', () => {
    const result = verifyOnValidEmail('usergmail.com');

    expect(result).toBe(validationErrors['invalid-email']);
  });

  it.each(['', undefined, null])('Result of function verifyOnValidUrl should return an error message', (value) => {
    const result = verifyOnValidUrl(value);

    expect(result).toEqual(validationErrors['invalid-url']);
  });

  it('Result of function verifyOnValidUrl should return undefined', () => {
    const result = verifyOnValidUrl('http:\\google.com');

    expect(result).toBeUndefined();
  });
});
