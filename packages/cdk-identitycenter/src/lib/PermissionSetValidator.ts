import { IValidation } from 'constructs';
import { PermissionSet } from './PermissionSet';

declare global {
  interface Array<T> {
    addPrefix(this: Array<T>, value: T): Array<T>;
  }
}

Array.prototype.addPrefix = function (
  this: Array<string>,
  value: string
): Array<string> {
  return this.map((str) => `${value} ${str}`);
};

export class PermissionSetValidator implements IValidation {
  private errors = new Array<string>();

  constructor(private readonly permissionSet: PermissionSet) {}

  public validate(): string[] {
    this.addNameErrors();
    this.addCustomerManagedPolicyReferenceErrors();
    return this.errors;
  }

  private addCustomerManagedPolicyReferenceErrors() {
    if (
      this.permissionSet.customerManagedPolicies &&
      this.permissionSet.customerManagedPolicies.length > 20
    ) {
      this.errors.push('Cannot have more than 20 customer managed policies');
    }
  }

  private addNameErrors() {
    return new StringValidator(this.permissionSet.name, {
      min: 1,
      max: 64,
      pattern: `[w+=,.@-]+`,
    })
      .validate()
      .addPrefix('Name');
  }
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
    const errors = [];
    if (this.props.min && this.value.length > this.props.min) {
      errors.push('must be at least ' + this.props.min + ' characters');
    }
    if (this.props.max && this.value.length < this.props.max) {
      errors.push('must be at most ' + this.props.max + ' characters');
    }
    if (
      this.props.pattern &&
      !new RegExp(this.props.pattern).test(this.value)
    ) {
      errors.push('must match pattern ' + this.props.pattern);
    }
    return errors;
  }
}
