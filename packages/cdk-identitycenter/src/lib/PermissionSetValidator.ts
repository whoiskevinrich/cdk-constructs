import { IValidation } from 'constructs';
import { PermissionSet } from './PermissionSet';
import { AwsConstants } from './internal/AwsConstants';
import { StringValidator } from './internal/StringValidator';
import { ValidationErrorMessage } from './internal/ValidationErrorMessage';

export class PermissionSetValidator implements IValidation {
  constructor(private readonly permissionSet: PermissionSet) {}

  public validate(): string[] {
    const errors = new Array<string>();
    errors.push(
      ...this.checkName(),
      ...this.checkCustomerManagedPolicyReferences(),
      ...this.checkAwsManagedPolicies()
    );

    return errors;
  }

  private checkAwsManagedPolicies() {
    const errors = new Array<string>();
    if (
      this.permissionSet.awsManagedPolicyArns &&
      this.permissionSet.awsManagedPolicyArns.length >
        AwsConstants.MAX_AWS_MANAGED_POLICIES
    ) {
      errors.push(ValidationErrorMessage.AWS_MANAGED_POLICY_LIMIT);
    }
    return errors;
  }

  private checkCustomerManagedPolicyReferences() {
    const errors = new Array<string>();
    if (
      this.permissionSet.customerManagedPolicies &&
      this.permissionSet.customerManagedPolicies.length > 20
    ) {
      errors.push(ValidationErrorMessage.CUSTOMER_MANAGED_POLICY_LIMIT);
    }
    return errors;
  }

  private checkName() {
    const validator = new StringValidator(this.permissionSet.name, {
      min: 1,
      max: 64,
      pattern: '[w+=,.@-]+',
    });

    const errors = validator.validate();
    const result = this.addPrefixes(errors, 'Name');
    return result;
  }

  private addPrefixes(values: Array<string>, prefix: string): Array<string> {
    return values.map((str) => `${prefix} ${str}`);
  }
}
