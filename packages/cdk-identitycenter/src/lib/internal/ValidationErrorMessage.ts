import { AwsConstants } from './AwsConstants';

export class ValidationErrorMessage {
  public static readonly CUSTOMER_MANAGED_POLICY_LIMIT = `Cannot have more than ${AwsConstants.MAX_CUSTOMER_MANAGED_POLICIES.toString()} customer managed policies`;
  public static readonly AWS_MANAGED_POLICY_LIMIT = `Cannot have more than ${AwsConstants.MAX_AWS_MANAGED_POLICIES.toString()} AWS managed policies`;
}
