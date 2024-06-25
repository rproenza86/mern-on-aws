import * as AWS_RAW from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';

const AWS = AWSXRay.captureAWS(AWS_RAW);
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
        const data = JSON.parse(event.body as string);
        const params = {
            TableName: TABLE_NAME,
            Key: {
                TodoID: todoId,
                CreatedAt: createdAt
            },
            UpdateExpression: "set Title = :t, Description = :d, #status = :s, UpdatedAt = :ua",
            ExpressionAttributeValues: {
                ":t": data.Title,
                ":d": data.Description,
                ":s": data.Status,
                ":ua": new Date().toISOString()
            },
            ExpressionAttributeNames: {
              '#status': 'Status'  // Mapping 'Status' to an expression attribute name because it is a reserved word
            },
            ReturnValues: "UPDATED_NEW"
        };

        await dynamoDb.update(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "TODO updated successfully." }),
            headers: { "Access-Control-Allow-Origin": "*" }
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to update TODO" }),
            headers: { "Access-Control-Allow-Origin": "*" }
        };
    }
};
