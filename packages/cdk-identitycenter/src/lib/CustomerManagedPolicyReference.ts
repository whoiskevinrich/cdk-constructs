import * as core from 'aws-cdk-lib/core';

// https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk-lib/aws-iam/lib/user.ts
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html

export class CustomerManagedPolicyReference implements core.IResolvable {
  public readonly creationStack: string[];

  constructor(public readonly name: string, public readonly path: string) {
    this.creationStack = core.captureStackTrace();
  }

  public resolve(_context: core.IResolveContext) {
    return {
      Name: this.name,
      Path: this.path,
    };
  }
}
