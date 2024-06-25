import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class CognitoConstruct extends Construct {
    public readonly userPool: cognito.UserPool;
    public readonly userPoolClient: cognito.UserPoolClient;
    public readonly identityPool: cognito.CfnIdentityPool;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        // Create User Pool
        this.userPool = new cognito.UserPool(this, 'UserPool', {
            selfSignUpEnabled: true,
            signInAliases: { email: true },
            autoVerify: { email: true },
            passwordPolicy: {
                minLength: 8,
                requireLowercase: true,
                requireUppercase: true,
                requireDigits: true,
                requireSymbols: true,
            },
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
        });

        // Create the User Pool Client
        this.userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
            userPool: this.userPool,
            generateSecret: false,
        });

        // Create an Identity Pool
        this.identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
            allowUnauthenticatedIdentities: true,
            cognitoIdentityProviders: [{
            clientId: this.userPoolClient.userPoolClientId,
            providerName: this.userPool.userPoolProviderName,
            }],
        });
  

        // User Pool and Client Details
        new cdk.CfnOutput(this, 'UserPoolId', {
            value: this.userPool.userPoolId,
        });

        new cdk.CfnOutput(this, 'UserPoolClientId', {
            value: this.userPoolClient.userPoolClientId,
        });

        // Identity Pool Details
        new cdk.CfnOutput(this, 'IdentityPoolId', {
            value: this.identityPool.ref,
        });
    }
}