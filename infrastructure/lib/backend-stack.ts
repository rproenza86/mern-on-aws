import * as cdk from 'aws-cdk-lib';
import { aws_lambda as lambda, aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface BackendConstructProps {
    todoTable: dynamodb.Table;
}

export class BackendConstruct extends Construct {
    constructor(scope: Construct, id: string, props: BackendConstructProps) {
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

        // Create TODO Lambda function
        const createTodoLambda = new lambda.Function(this, 'CreateTodoLambda', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'createTodo.handler', // This should match your file name and export
            code: lambda.Code.fromAsset('../backend/dist/lambdas/todos'), // Path to the Lambda code
            environment: {
                TODO_TABLE_NAME: props.todoTable.tableName
            }
        });
        // Grant the Lambda function permissions to write to the DynamoDB table
        props.todoTable.grantWriteData(createTodoLambda);
        // Define the /todo resource path
        const todoResource = api.root.addResource('todo');
        // Lambda integration
        const createTodoLambdaIntegration = new LambdaIntegration(createTodoLambda, {
            requestTemplates: { "application/json": '{ "statusCode": 200 }' }
        });
        // Adding POST method to /todo resource to create a TODO
        todoResource.addMethod('POST', createTodoLambdaIntegration);
        // Output API endpoint
        new cdk.CfnOutput(this, 'APITodoEndpoint', {
            value: `${api.url}todo`
        });
    }
}
