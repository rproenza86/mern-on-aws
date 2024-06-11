import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class S3Construct extends Construct {
    public readonly imageBucket: cdk.aws_s3.Bucket;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        // Create S3 bucket for image uploads
        this.imageBucket = new Bucket(this, 'ImageBucket', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            publicReadAccess: false
        });
    }
}