import * as cdk from 'aws-cdk-lib';
import { BlockPublicAccess, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { aws_s3 as s3, aws_cloudfront as cloudfront, aws_s3_deployment as s3deploy, CfnOutput } from 'aws-cdk-lib';

import { BackendConstruct} from './backend-stack';
import { DataBaseConstruct } from './database-stack';
import { CognitoConstruct } from './cognito-stack';
import { S3Construct } from './s3-constructs';

export class TodoAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Add S3 resources
    const s3Resource = new S3Construct(this, 'S3Service');

    // CloudFront distribution for the S3 bucket
    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'TodoAppDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: s3Resource.siteBucket
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ]
    });

    // Deploy website contents to S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('../frontend/build')],
      destinationBucket: s3Resource.siteBucket,
      distribution: distribution,
    });

    // log the CloudFront URL to the output to access the website from internet
    new CfnOutput(this, 'WebsiteURL', {
      value: distribution.distributionDomainName,
    });

    // Add database resources
    const db = new DataBaseConstruct(this, 'DataBaseService');

    // Add Cognito resources
    const cognito = new CognitoConstruct(this, 'CognitoService');

    // Add backend resources
    new BackendConstruct(this, 'BackendServices', { todoTable: db.todoTable,  userPool: cognito.userPool, imageBucket: s3Resource.imageBucket });
  }
}
