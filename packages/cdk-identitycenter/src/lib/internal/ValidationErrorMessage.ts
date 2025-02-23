import { PermissionSetConstants } from './Constants';

export class ValidationErrorMessage {
  public static readonly NAME_LENGTH_MAX = `Name cannot exceed ${PermissionSetConstants.NAME_LENGTH_MAX.toString()} characters`;
  public static readonly NAME_LENGTH_MIN = `Name must be at least ${PermissionSetConstants.NAME_LENGTH_MIN.toString()} characters`;
  public static readonly NAME_REGEX = `Name can only contain alphanumeric characters, plus signs, periods, underscores, and dashes (${PermissionSetConstants.NAME_REGEX})`;

  public static readonly DESCRIPTION_LENGTH_MAX = `Description cannot exceed ${PermissionSetConstants.DESCRIPTION_LENGTH_MAX.toString()} characters`;

  public static readonly CUSTOMER_MANAGED_POLICIES_COUNT_MAX = `Cannot have more than ${PermissionSetConstants.CUSTOMER_MANAGED_POLICIES_COUNT_MAX.toString()} customer managed policies`;

  public static readonly AWS_MANAGED_POLICIES_COUNT_MAX = `Cannot have more than ${PermissionSetConstants.AWS_MANAGED_POLICIES_COUNT_MAX.toString()} AWS managed policies`;

  public static readonly INLINE_POLICY_LENGTH_MAX = `Inline policy cannot exceed ${PermissionSetConstants.INLINE_POLICY_LENGTH_MAX.toString()} characters`;
}
