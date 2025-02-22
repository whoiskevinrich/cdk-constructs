import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ic from '../index';

// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sso-permissionset.html

describe('PermissionSet', () => {
  const baseProps = {
    instanceArn: 'arn:aws:sso:::instance/ssoins-1234567890abcdef0',
    name: 'MyPermissionSet',
  };

  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  it('should use provided instance ARN', () => {
    new ic.PermissionSet(stack, 'MyPermissionSet', {
      ...baseProps,
      instanceArn: 'abc',
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::SSO::PermissionSet', {
      InstanceArn: 'abc',
    });
  });

  describe('Customer Managed Policies', () => {
    it('should be idempotent when the same policy is added twice', () => {
      const managedPolicyRefs = [
        new ic.CustomerManagedPolicyReference(
          'MyManagedPolicy',
          '/path/to/policy'
        ),
        new ic.CustomerManagedPolicyReference(
          'MyManagedPolicy',
          '/path/to/policy'
        ),
      ];

      new ic.PermissionSet(stack, 'MyPermissionSet', {
        ...baseProps,
        customerManagedPolicies: managedPolicyRefs,
      });

      const template = Template.fromStack(stack);

      template.hasResourceProperties('AWS::SSO::PermissionSet', {
        Name: 'MyPermissionSet',
        CustomerManagedPolicyReferences: Match.arrayEquals([
          // fails with more than one element
          Match.objectLike({
            Name: 'MyManagedPolicy',
          }),
        ]),
      });
    });
  });

  describe('Inline Policy', () => {
    it.skip('should', () => {
      throw new Error('Not implemented');
    });
  });

  describe('AWS Managed Policies', () => {
    it.skip('should allow up to 20 policies', () => {
      let count = 0;
      const managedPolicies = new Array(21).fill(
        `arn:aws:iam::aws:policy/MyPolicy-${count++}`
      );

      new ic.PermissionSet(stack, 'MyPermissionSet', {
        ...baseProps,
        awsManagedPolicyArns: managedPolicies,
      });

      const validationErrors = stack.node.validate();
      expect(validationErrors).toContain(
        'Cannot have more than 20 AWS managed policies'
      );
    });
    it.skip('should throw when more than 20 policies are provided', () => {
      throw new Error('Not implemented');
    });
  });

  describe('Name', () => {
    it('should use the provided name', () => {
      new ic.PermissionSet(stack, 'NamedPermissionSet', {
        ...baseProps,
        name: 'TestPermissionSet',
      });

      const template = Template.fromStack(stack);

      template.hasResourceProperties('AWS::SSO::PermissionSet', {
        Name: 'TestPermissionSet',
      });
    });
  });

  describe('Permissions Boundary', () => {
    it.skip('should accept a CustomerManaged policy', () => {
      throw new Error('Not implemented');
    });
    it.skip('should accept a Managed policy', () => {
      throw new Error('Not implemented');
    });
  });

  describe('Relay State Type', () => {
    it.skip('should', () => {
      throw new Error('Not implemented');
    });
  });

  describe('Session Duration', () => {
    it.skip('should emit an ISO-8601 standard time', () => {
      throw new Error('Not implemented');
    });
  });

  describe('Tags', () => {
    it.skip('should', () => {
      throw new Error('Not implemented');
    });
  });
});
