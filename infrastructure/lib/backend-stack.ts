import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { aws_lambda as lambda, aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { AccessLogFormat, AuthorizationType, CognitoUserPoolsAuthorizer, Cors, LambdaIntegration, LogGroupLogDestination, MethodLoggingLevel, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { LogGroup } from 'aws-cdk-lib/aws-logs';

interface BackendConstructProps {
    todoTable: dynamodb.Table;
    userPool: cognito.UserPool;
    imageBucket: cdk.aws_s3.Bucket;
}

export class BackendConstruct extends Construct {
    constructor(scope: Construct, id: string, props: BackendConstructProps) {
        super(scope, id);

        // Add API Gateway
        const api = new RestApi(this, 'TodoApiGw', {
            restApiName: 'TODOs API Service',
            description: 'This service serves the lambda of the TODO web app.',
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowHeaders: ['*'],
                allowMethods: Cors.ALL_METHODS
            },
            deployOptions: {
                loggingLevel: MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
                tracingEnabled: true, // Enable X-Ray Tracing
                // enable CloudWatch Log
                accessLogDestination: new LogGroupLogDestination(new LogGroup(this, 'ApiAccessLogGroup', {
                    logGroupName: `/aws/api-gw-todo-service`,
                    removalPolicy: cdk.RemovalPolicy.DESTROY
                })),
                accessLogFormat: AccessLogFormat.jsonWithStandardFields({
                    caller: true,
                    httpMethod: true,
                    ip: true,
                    protocol: true,
                    requestTime: true,
                    resourcePath: true,
                    responseLength: true,
                    status: true,
                    user: true,
                }),
            }
        });
        // Define the /todo resource path
        const todoResource = api.root.addResource('todo');
        const singleTodoResource = todoResource.addResource('{todoId}');
        const genPresignedUrl = todoResource.addResource('s3PresignedUrl');

        // Create the Cognito Authorizer
        const authorizer = new CognitoUserPoolsAuthorizer(this, 'CognitoAuthorizer', {
            cognitoUserPools: [props.userPool]
        });

        // Create the GET /todo/s3PresignedUrl lambda function
        const genPresignedUrlLambda = new lambda.Function(this, 'GenPresignedUrlLambda', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'genPresignedUrl.handler', // This should match your file name and export
            code: lambda.Code.fromAsset('../backend/dist/lambdas/s3'), // Path to the Lambda code
            environment: {
                BUCKET_NAME: props.imageBucket.bucketName
            }
        });
        // Grant the Lambda function permission to generate presigned URLs from S3 bucket    
        props.imageBucket.grantPutAcl(genPresignedUrlLambda); 
        props.imageBucket.grantReadWrite(genPresignedUrlLambda);
        
        // Lambda integration
        const getGenPresignedUrlLambda = new LambdaIntegration(genPresignedUrlLambda, {
            requestTemplates: { "application/json": '{ "statusCode": 200 }' }
        });
        // Adding GET method to /todo resource to fetch all TODOs
        genPresignedUrl.addMethod('GET', getGenPresignedUrlLambda, {
            authorizer,
            authorizationType: AuthorizationType.COGNITO
        });


        // Create TODO Lambda function
        const createTodoLambda = new lambda.Function(this, 'CreateTodoLambda', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'createTodo.handler', // This should match your file name and export
            code: lambda.Code.fromAsset('../backend/dist/lambdas/todos'), // Path to the Lambda code
            environment: {
                TODO_TABLE_NAME: props.todoTable.tableName,
                BUCKET_NAME: props.imageBucket.bucketName
            }
        });
        // Grant the Lambda function permissions to write to the DynamoDB table and S3 bucket
        props.todoTable.grantWriteData(createTodoLambda);
        props.imageBucket.grantPut(createTodoLambda);
        // Lambda integration
        const createTodoLambdaIntegration = new LambdaIntegration(createTodoLambda, {
            requestTemplates: { "application/json": '{ "statusCode": 200 }' }
        });
        // Adding POST method to /todo resource to create a TODO
        todoResource.addMethod('POST', createTodoLambdaIntegration, {
            authorizer,
            authorizationType: AuthorizationType.COGNITO,
            methodResponses: [{
                statusCode: '200',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Headers': true,
                    'method.response.header.Access-Control-Allow-Methods': true,
                    'method.response.header.Access-Control-Allow-Origin': true,
                }
            }]
        });

        // GET TODO Lambda function
        const getTodoLambda = new lambda.Function(this, 'GetTodosLambda', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'getTodos.handler', // This should match your file name and export
            code: lambda.Code.fromAsset('../backend/dist/lambdas/todos'), // Path to the Lambda code
            environment: {
                TODO_TABLE_NAME: props.todoTable.tableName
            }
        });
        // Grant the Lambda function permissions to read to the DynamoDB table and S3 bucket
        props.todoTable.grantReadData(getTodoLambda);
        props.imageBucket.grantRead(createTodoLambda);
        // Lambda integration
        const getTodoLambdaIntegration = new LambdaIntegration(getTodoLambda, {
            requestTemplates: { "application/json": '{ "statusCode": 200 }' }
        });
        // Adding GET method to /todo resource to fetch all TODOs
        todoResource.addMethod('GET', getTodoLambdaIntegration, {
            authorizer,
            authorizationType: AuthorizationType.COGNITO
        });


        // Lambda function for updating a TODO
        const updateTodoLambda = new lambda.Function(this, 'UpdateTodoLambda', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'updateTodo.handler',
            code: lambda.Code.fromAsset('../backend/dist/lambdas/todos'),
            environment: {
                TODO_TABLE_NAME: props.todoTable.tableName
            }
        });
        // Grant the Lambda function permissions to delete from the DynamoDB table and S3 bucket
        props.todoTable.grantReadWriteData(updateTodoLambda);
        props.imageBucket.grantReadWrite(createTodoLambda);
        // Set up the API Gateway endpoint for DELETE requests
        singleTodoResource.addMethod('PUT', new LambdaIntegration(updateTodoLambda), {
            authorizer,
            authorizationType: AuthorizationType.COGNITO
        });


        // Lambda function for deleting TODOs
        const deleteTodoLambda = new lambda.Function(this, 'DeleteTodoLambda', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'deleteTodo.handler',
            code: lambda.Code.fromAsset('../backend/dist/lambdas/todos'),
            environment: {
                TODO_TABLE_NAME: props.todoTable.tableName
            }
        });
        // Grant the Lambda function permissions to delete from the DynamoDB table and S3 bucket
        props.todoTable.grantReadWriteData(deleteTodoLambda);
        props.imageBucket.grantDelete(createTodoLambda);
        // Set up the API Gateway endpoint for DELETE requests
        // <API>/todo/{todoId}
        singleTodoResource.addMethod('DELETE', new LambdaIntegration(deleteTodoLambda), {
            authorizer,
            authorizationType: AuthorizationType.COGNITO
        });

        // Output API endpoint
        new cdk.CfnOutput(this, 'APITodoEndpoint', {
            value: `${api.url}todo`
        });
    }
}
