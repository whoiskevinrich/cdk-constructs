import { Stack } from 'aws-cdk-lib/core';
import { CustomerManagedPolicyReference } from './CustomerManagedPolicyReference';
import { ValidationErrorMessage } from './internal/ValidationErrorMessage';
import { PermissionSet, PermissionSetProps } from './PermissionSet';
import { PermissionSetValidator } from './PermissionSetValidator';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html

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
    it('should return errors when more than 20 policies are provided', () => {
      let i = 1;
      const managedPolicyRefs = new Array(21).fill(
        new CustomerManagedPolicyReference(
          `MyManagedPolicy-${i++}`,
          '/path/to/policy'
        )
      );

      const permissionSet = new PermissionSet(stack, 'MyPermissionSet', {
        ...basePermissionSetProps,
        customerManagedPolicies: managedPolicyRefs,
      });

      const sut = new PermissionSetValidator(permissionSet);

      const validationErrors = sut.validate();
      expect(validationErrors).toContain(
        ValidationErrorMessage.CUSTOMER_MANAGED_POLICY_LIMIT
      );
    });
  });

  describe('AWS Managed Policies', () => {
    it('should return errors when more than 20 policies are provided', () => {
      let i = 1;
      const managedPolicyArns = new Array(21).fill(
        `arn:aws:iam::aws:policy/MyManagedPolicy-${i++}`
      );

      const permissionSet = new PermissionSet(stack, 'MyPermissionSet', {
        ...basePermissionSetProps,
        awsManagedPolicyArns: managedPolicyArns,
      });

      const sut = new PermissionSetValidator(permissionSet);

      const validationErrors = sut.validate();
      expect(validationErrors).toContain(
        ValidationErrorMessage.AWS_MANAGED_POLICY_LIMIT
      );
    });
  });

  describe('Inline Policies', () => {
    it('should return errors when the inline policy exceeds 32,768 characters', () => {
      const inlinePolicy = JSON.stringify(
        new Array(1000).fill('a'.repeat(32)).join('')
      );

      const permissionSet = new PermissionSet(stack, 'MyPermissionSet', {
        ...basePermissionSetProps,
        inlinePolicy: inlinePolicy,
      });

      const sut = new PermissionSetValidator(permissionSet);

      const validationErrors = sut.validate();
      expect(validationErrors).toContain(
        ValidationErrorMessage.INLINE_POLICY_CHARACTER_LIMIT
      );
    });
  });
});
