import { IValidation } from 'constructs';
import { PermissionSet } from './PermissionSet';
import { PermissionSetConstants } from './internal/Constants';
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
        PermissionSetConstants.AWS_MANAGED_POLICIES_COUNT_MAX
    ) {
      errors.push(ValidationErrorMessage.AWS_MANAGED_POLICIES_COUNT_MAX);
    }
    return errors;
  }

  private checkCustomerManagedPolicyReferences() {
    const errors = new Array<string>();
    if (
      this.permissionSet.customerManagedPolicies &&
      this.permissionSet.customerManagedPolicies.length > 20
    ) {
      errors.push(ValidationErrorMessage.CUSTOMER_MANAGED_POLICIES_COUNT_MAX);
    }
    return errors;
  }

  private checkName() {
    const errors = new Array<string>();

    if (
      this.permissionSet.name.length > PermissionSetConstants.NAME_LENGTH_MAX
    ) {
      errors.push(ValidationErrorMessage.NAME_LENGTH_MAX);
    }

    if (
      this.permissionSet.name.length < PermissionSetConstants.NAME_LENGTH_MIN
    ) {
      errors.push(ValidationErrorMessage.NAME_LENGTH_MAX);
    }

    if (this.permissionSet.name.match(PermissionSetConstants.NAME_REGEX)) {
      errors.push(ValidationErrorMessage.NAME_REGEX);
    }

    return errors;
  }
}
