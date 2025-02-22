import * as core from 'aws-cdk-lib/core';

export class CustomerManagedPolicyReference implements core.IResolvable {
  public readonly creationStack: string[];

  constructor(public readonly name: string, public readonly path: string) {
    this.creationStack = core.captureStackTrace();
  }

  // we don't plan to use the context here, so we can ignore it
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public resolve(_context: core.IResolveContext) {
    return {
      Name: this.name,
      Path: this.path,
    };
  }
}
