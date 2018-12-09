export interface IError {
  message: string;
  code: string;
}

export class ValidationResult<T> {
  public readonly errors: T;
  public readonly isValid: boolean;

  constructor(errors: T) {
    const json = JSON.stringify(errors);
    this.errors = errors;
    this.isValid = json === '{}';
  }
}
