import * as core from 'aws-cdk-lib/core';

// https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk-lib/aws-iam/lib/user.ts
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html

export class CustomerManagedPolicyReference implements core.IResolvable {
  public readonly creationStack: string[];

  constructor(public readonly name: string, public readonly path: string) {
    this.creationStack = core.captureStackTrace();
  }

  public resolve(context: core.IResolveContext): any {
    //github.com/aws/aws-cdk/blob/main/packages/aws-cdk-lib/aws-iam/lib/policy-document.ts#L77
  }
}
