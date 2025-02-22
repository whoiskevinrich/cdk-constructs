import { Stack } from 'aws-cdk-lib/core';
import { CustomerManagedPolicyReference } from './CustomerManagedPolicyReference';
import { PermissionSet, PermissionSetProps } from './PermissionSet';
import { PermissionSetValidator } from './PermissionSetValidator';

describe('PermissionSetValidator', () => {
  const basePermissionSetProps: PermissionSetProps = {
    name: 'MyPermissionSet',
    instanceArn: 'arn:aws:sso:::instance/ssoins-1234567890abcdef0',
  };

  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  describe('Customer Managed Policies', () => {
    it('should be invalid when more than 20 policies are provided', () => {
      const managedPolicyRefs = new Array(21).fill(
        new CustomerManagedPolicyReference('MyManagedPolicy', '/path/to/policy')
      );

      const permissionSet = new PermissionSet(stack, 'MyPermissionSet', {
        ...basePermissionSetProps,
        customerManagedPolicies: managedPolicyRefs,
      });

      const sut = new PermissionSetValidator(permissionSet);

      const validationErrors = sut.validate();
      expect(validationErrors).toContain(
        'Cannot have more than 20 customer managed policies'
      );
    });
  });
});
