import * as cdk from 'aws-cdk-lib';
import { BlockPublicAccess, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { aws_s3 as s3, aws_cloudfront as cloudfront, aws_s3_deployment as s3deploy, CfnOutput } from 'aws-cdk-lib';

import { BackendConstruct} from './backend-stack';

export class TodoAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 bucket for hosting React app
    const siteBucket = new s3.Bucket(this, 'TodoAppBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    });

    // CloudFront distribution for the S3 bucket
    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'TodoAppDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: siteBucket
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ]
    });

    // Deploy website contents to S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('../frontend/build')],
      destinationBucket: siteBucket,
      distribution: distribution,
    });

    // log the CloudFront URL to the output to access the website from internet
    new CfnOutput(this, 'WebsiteURL', {
      value: distribution.distributionDomainName,
    });

    // Add backend resources
    new BackendConstruct(this, 'BackendConstruct');
  }
}
