export const validationErrors = {
  'email-is-empty': { message: 'Email field is required', code: 'email-is-empty' },
  'invalid-email': { message: 'Email is invalid', code: 'invalid-email' },
  'invalid-url': { message: 'Not a valid URL', code: 'invalid-url' },
  'name-invalid-length': { message: 'Name must be between 2 and 30 characters', code: 'name-invalid-length' },
  'name-is-empty': { message: 'Name field is required', code: 'name-is-empty' },
  'password-invalid-length': { message: 'Password must be at least 6 characters', code: 'password-invalid-length' },
  'password-is-empty': { message: 'Password field is required', code: 'password-is-empty' },
};

export const registrationErrors = {
  'email-exists': { message: 'Email already exists', code: 'email-exists' },
  'user-registration-failed': { message: 'New user registration failed', code: 'user-registration-failed' },
};

export const loginErrors = {
  'password-incorrect': { message: 'Password incorrect', code: 'password-incorrect' },
  'user-is-not-found': { message: 'The user is not found', code: 'user-is-not-found' },
};
