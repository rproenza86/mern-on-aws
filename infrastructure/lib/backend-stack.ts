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
        const api = new RestApi(this, 'TodoApiGw', {
            restApiName: 'TODOs API Service',
            description: 'This service serves the lambda of the TODO web app.',
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowHeaders: ['*'],
                allowMethods: Cors.ALL_METHODS
            }
        });
        // Define the /todo resource path
        const todoResource = api.root.addResource('todo');
        const singleTodoResource = todoResource.addResource('{todoId}');

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
        // Lambda integration
        const createTodoLambdaIntegration = new LambdaIntegration(createTodoLambda, {
            requestTemplates: { "application/json": '{ "statusCode": 200 }' }
        });
        // Adding POST method to /todo resource to create a TODO
        todoResource.addMethod('POST', createTodoLambdaIntegration);

        // GET TODO Lambda function
        const getTodoLambda = new lambda.Function(this, 'GetTodosLambda', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'getTodos.handler', // This should match your file name and export
            code: lambda.Code.fromAsset('../backend/dist/lambdas/todos'), // Path to the Lambda code
            environment: {
                TODO_TABLE_NAME: props.todoTable.tableName
            }
        });
        // Grant the Lambda function permissions to read to the DynamoDB table
        props.todoTable.grantReadData(getTodoLambda);
        // Lambda integration
        const getTodoLambdaIntegration = new LambdaIntegration(getTodoLambda, {
            requestTemplates: { "application/json": '{ "statusCode": 200 }' }
        });
        // Adding GET method to /todo resource to fetch all TODOs
        todoResource.addMethod('GET', getTodoLambdaIntegration);


        // Lambda function for updating a TODO
        const updateTodoLambda = new lambda.Function(this, 'UpdateTodoLambda', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'updateTodo.handler',
            code: lambda.Code.fromAsset('../backend/dist/lambdas/todos'),
            environment: {
                TODO_TABLE_NAME: props.todoTable.tableName
            }
        });
        // Grant the Lambda function permissions to delete from the DynamoDB table
        props.todoTable.grantReadWriteData(updateTodoLambda);
        // Set up the API Gateway endpoint for DELETE requests
        singleTodoResource.addMethod('PUT', new LambdaIntegration(updateTodoLambda));


        // Lambda function for deleting TODOs
        const deleteTodoLambda = new lambda.Function(this, 'DeleteTodoLambda', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'deleteTodo.handler',
            code: lambda.Code.fromAsset('../backend/dist/lambdas/todos'),
            environment: {
                TODO_TABLE_NAME: props.todoTable.tableName
            }
        });
        // Grant the Lambda function permissions to delete from the DynamoDB table
        props.todoTable.grantReadWriteData(deleteTodoLambda);
        // Set up the API Gateway endpoint for DELETE requests
        // <API>/todo/{todoId}
        singleTodoResource.addMethod('DELETE', new LambdaIntegration(deleteTodoLambda));

        // Output API endpoint
        new cdk.CfnOutput(this, 'APITodoEndpoint', {
            value: `${api.url}todo`
        });
    }
}
