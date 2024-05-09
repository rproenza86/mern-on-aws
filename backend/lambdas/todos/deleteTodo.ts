import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TODO_TABLE_NAME ?? '';

export const handler: APIGatewayProxyHandler = async (event) => {
    const todoId = event.pathParameters ? event.pathParameters.todoId : null;    
    const createdAt = event.queryStringParameters ? event.queryStringParameters.createdAt : null;

    if (!todoId || !createdAt) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Both TODO ID and CreatedAt are required." }),
            headers: { "Access-Control-Allow-Origin": "*" }
        };
    }

    try {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                TodoID: todoId,
                CreatedAt: createdAt
            }
        };

        await dynamoDb.delete(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "TODO deleted successfully." }),
            headers: { "Access-Control-Allow-Origin": "*" }
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to delete TODO" }),
            headers: { "Access-Control-Allow-Origin": "*" }
        };
    }
};
