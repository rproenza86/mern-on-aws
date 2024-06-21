import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BlockPublicAccess, Bucket, BucketAccessControl, CorsRule, HttpMethods } from 'aws-cdk-lib/aws-s3';

export class S3Construct extends Construct {
    public readonly siteBucket: cdk.aws_s3.Bucket;
    public readonly imageBucket: cdk.aws_s3.Bucket;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        // S3 bucket for hosting React app
        this.siteBucket = new Bucket(this, 'TodoAppBucket', {
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            publicReadAccess: true,
            autoDeleteObjects: true, // Only for dev purposes
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
            accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
        });

        // CORS rules for image uploads bucket
        const corsRule: CorsRule = {
            allowedMethods: [HttpMethods.GET, HttpMethods.PUT, HttpMethods.POST, HttpMethods.DELETE],
            allowedOrigins: ['*'],
            allowedHeaders: ['*'],
        };

        // Create S3 bucket for image uploads
        this.imageBucket = new Bucket(this, 'ImageBucket', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true, // Only for dev purposes
            cors: [corsRule]
        });
    }
}