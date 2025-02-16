import * as iam from 'aws-cdk-lib/aws-iam';
import * as sso from 'aws-cdk-lib/aws-sso';
import * as core from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { CustomerManagedPolicyReference } from 'src/lib/CustomerManagedPolicyReference';
import { InlinePolicy } from './InlinePolicy';
import { PermissionSetValidator } from './Validator';

export interface IPermissionSet extends core.IResource {
  /**
   * The ARN of the permission set.
   * @attribute
   */
  readonly permissionSetArn: string;

  /**
   * The ID of the permission set.
   * @attribute
   */
  readonly permissionSetId: string;
}

export interface PermissionSetProps {
  /**
   * The name of the permission set.
   */
  readonly name: string;

  /**
   * The customer managed policies that you have attached to your permission set.
   * @optional
   */
  readonly customerManagedPolicies?: CustomerManagedPolicyReference[];

  /**
   * An optional description for the permissions set.
   * @optional
   */
  readonly description?: string;

  readonly inlinePolicy?: InlinePolicy;

  readonly instanceArn: string;

  readonly awsManagedPolicyArns?: string[];

  readonly permissionsBoundary?: core.PermissionsBoundary;

  readonly relayStateType?: string;

  readonly sessionDuration?: string;

  readonly tags?: { [key: string]: string };
}

export class PermissionSet extends core.Resource implements IPermissionSet {
  public readonly permissionSet: sso.CfnPermissionSet;

  public readonly permissionSetArn: string;
  public readonly permissionSetId: string;

  public readonly name: string;

  public readonly customerManagedPolicies: CustomerManagedPolicyReference[];
  public readonly awsManagedPolicyArns?: string[];

  constructor(scope: Construct, id: string, props: PermissionSetProps) {
    super(scope, id);

    this.name = props.name;
    this.customerManagedPolicies = props.customerManagedPolicies || [];

    // https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk-lib/aws-iam/lib/user.ts#L268
    this.permissionSet = new sso.CfnPermissionSet(this, 'Resource', {
      name: this.name,
      instanceArn: props.instanceArn,
      customerManagedPolicyReferences: this.mapCustomerManagedPolicyReferences(
        props.customerManagedPolicies
      ),
      managedPolicies: props.awsManagedPolicyArns,
    });

    this.node.addValidation(new PermissionSetValidator(this));

    this.permissionSetArn = this.permissionSet.instanceArn;
    this.awsManagedPolicyArns = this.permissionSet.managedPolicies;
  }

  private mapCustomerManagedPolicyReferences(
    references: CustomerManagedPolicyReference[] | undefined
  ): sso.CfnPermissionSet.CustomerManagedPolicyReferenceProperty[] {
    if (!references) {
      return [];
    }

    const mappedCfnReferences: sso.CfnPermissionSet.CustomerManagedPolicyReferenceProperty[] =
      references.map((x: CustomerManagedPolicyReference) => {
        return {
          name: x.name,
          path: x.path,
        };
      });

    const uniqueMappedCfnReferences = this.getUniqueItems(mappedCfnReferences);
    return uniqueMappedCfnReferences;
  }

  private getUniqueItems(
    refs: sso.CfnPermissionSet.CustomerManagedPolicyReferenceProperty[]
  ): sso.CfnPermissionSet.CustomerManagedPolicyReferenceProperty[] {
    const seen = new Set<string>();

    return refs.filter((ref) => {
      const key = `${ref.name}-${ref.path}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }
}
