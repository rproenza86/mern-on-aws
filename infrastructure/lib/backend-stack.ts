import * as cdk from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { Cors, IResource, LambdaIntegration, MockIntegration, PassthroughBehavior, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class BackendConstruct extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        // Add API Gateway
        const api = new RestApi(this, 'HelloWorldApi', {
            restApiName: 'Hello World Service',
            description: 'This service serves the hello world lambda.',
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowHeaders: ['*'],
                allowMethods: Cors.ALL_METHODS
            }
        });

        // Example Lambda function
        const helloWorldLambda = new lambda.Function(this, 'HelloWorldLambda', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'index.handler', // This should match your file name and export
            code: lambda.Code.fromAsset('../backend/dist/lambdas/helloWorld'), // Path to the Lambda code
        });
        // Define the /helloWorld resource
        const helloWorldResource = api.root.addResource('helloWorld');

        // Lambda integration
        const lambdaIntegration = new LambdaIntegration(helloWorldLambda, {
            requestTemplates: { "application/json": '{ "statusCode": 200 }' }
        });
        // Adding GET method to /helloWorld resource
        helloWorldResource.addMethod('GET', lambdaIntegration);
        // Output API endpoint
        new cdk.CfnOutput(this, 'APIEndpoint', {
            value: `${api.url}helloWorld`
        });
    }
}
