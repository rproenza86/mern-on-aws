import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { FederatedPrincipal, Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';

interface IamConstructProps {
    identityPool: cognito.CfnIdentityPool;
}

export class IamConstruct extends Construct {
    public readonly rumRole: Role;
    public readonly authenticatedRole: Role;
    public readonly unauthenticatedRole: Role;

    constructor(scope: Construct, id: string, props: IamConstructProps) {
        super(scope, id);

        this.rumRole = new Role(this, 'CloudWatchRUMRole', {
            assumedBy: new ServicePrincipal('rum.amazonaws.com'),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName('AmazonCloudWatchRUMFullAccess'),
            ],
        });

        // Authenticated Role
        this.authenticatedRole = new Role(this, 'CognitoDefaultAuthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                'StringEquals': { 'cognito-identity.amazonaws.com:aud': props.identityPool.ref },
                'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'authenticated' }
            }, 'sts:AssumeRoleWithWebIdentity'),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName('AmazonCognitoPowerUser'),
                ManagedPolicy.fromAwsManagedPolicyName('AmazonCloudWatchRUMFullAccess')
            ]
        });

        // Unauthenticated Role
        this.unauthenticatedRole = new Role(this, 'CognitoDefaultUnauthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                'StringEquals': { 'cognito-identity.amazonaws.com:aud': props.identityPool.ref },
                'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'unauthenticated' }
            }, 'sts:AssumeRoleWithWebIdentity'),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName('AmazonCognitoPowerUser'),
                ManagedPolicy.fromAwsManagedPolicyName('AmazonCloudWatchRUMFullAccess')
            ]
        });

        // Attach roles to the Identity Pool
        new cognito.CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
            identityPoolId: props.identityPool.ref,
            roles: {
                'authenticated': this.authenticatedRole.roleArn,
                'unauthenticated': this.unauthenticatedRole.roleArn
            }
        });
    }
}