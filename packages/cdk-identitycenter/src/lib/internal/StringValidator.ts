import { IValidation } from 'constructs';

export enum ErrorMessageTemplate {
  MIN_LENGTH = '{property} must be at least {length} characters',
  MAX_LENGTH = '{property} must be at most {length} characters',
  PATTERN = `{property} must match pattern '{pattern}'`,
}

export interface StringValidatorProps {
  min?: number;
  max?: number;
  pattern?: string;
}

export class StringValidator implements IValidation {
  constructor(
    private readonly value: string,
    private readonly props: StringValidatorProps
  ) {}

  public validate(): string[] {
    const errors = new Array<string>();

    errors.concat([
      ...this.addMinLengthError(),
      ...this.addMaxLengthError(),
      ...this.addPatternError(),
    ]);

    return errors;
  }

  private addMinLengthError(): string[] {
    if (!this.props.min || this.value.length >= this.props.min) {
      return [];
    }

    const template = ErrorMessageTemplate.MIN_LENGTH;
    const msg = template
      .replace('{property}', this.value)
      .replace('{length}', this.props.min.toString());

    return [msg];
  }

  private addMaxLengthError(): string[] {
    if (!this.props.max || this.value.length <= this.props.max) {
      return [];
    }

    const template = ErrorMessageTemplate.MAX_LENGTH;
    const msg = template
      .replace('{property}', this.value)
      .replace('{length}', this.props.max.toString());

    return [msg];
  }

  private addPatternError(): string[] {
    if (!this.props.pattern) {
      return [];
    }

    const regex = new RegExp(this.props.pattern);
    if (!regex.test(this.value)) {
      return [];
    }

    const template = ErrorMessageTemplate.PATTERN;
    const msg = template
      .replace('{property}', this.value)
      .replace('{pattern}', this.props.pattern);
    return [msg];
  }
}
