// See: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html

export class PermissionSetConstants {
  public static readonly NAME_LENGTH_MAX = 32;
  public static readonly NAME_LENGTH_MIN = 1;
  public static readonly NAME_REGEX = '[w+=,.@-]+';

  public static readonly DESCRIPTION_LENGTH_MAX = 700;

  public static readonly CUSTOMER_MANAGED_POLICIES_COUNT_MAX = 20;

  public static readonly AWS_MANAGED_POLICIES_COUNT_MAX = 20;

  public static readonly INLINE_POLICY_LENGTH_MAX = 32768;
}
