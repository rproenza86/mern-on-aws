import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Role } from 'aws-cdk-lib/aws-iam';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { CfnAppMonitor } from 'aws-cdk-lib/aws-rum';

interface RumConstructProps {
    identityPool: cognito.CfnIdentityPool;
    unauthenticatedRole: Role;
}

export class RumConstruct extends Construct {
    public readonly appMonitor: CfnAppMonitor;

    constructor(scope: Construct, id: string, props: RumConstructProps) {
        super(scope, id);

        this.appMonitor = new CfnAppMonitor(this, 'AppMonitor', {
            name: 'TodoAppMonitor',
            domain: 'd1yla3x3lggk6f.cloudfront.net', // Replace with your domain
            appMonitorConfiguration: {
                allowCookies: true,
                enableXRay: true,
                guestRoleArn: props.unauthenticatedRole.roleArn, // Replace with your IAM role ARN
                identityPoolId: props.identityPool.ref, // Replace with your Cognito Identity Pool ID
                sessionSampleRate: 1.0,
                telemetries: ['errors', 'performance', 'http']
            },  
        });

        const localhostAppMonitor = new CfnAppMonitor(this, 'AppMonitorLocalhost', {
            name: 'TodoAppMonitorLocalhost',
            domain: 'localhost', // Replace with your domain
            appMonitorConfiguration: {
                allowCookies: true,
                enableXRay: true,
                guestRoleArn: props.unauthenticatedRole.roleArn, // Replace with your IAM role ARN
                identityPoolId: props.identityPool.ref, // Replace with your Cognito Identity Pool ID
                sessionSampleRate: 1.0,
                telemetries: ['errors', 'performance', 'http']
            },  
        });

        new cdk.CfnOutput(this, 'AppMonitorId', {
            value: this.appMonitor.attrId,
        });
        new cdk.CfnOutput(this, 'AppMonitorLocalhostId', {
            value: localhostAppMonitor.attrId,
        });
    }
}