import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TODO_TABLE_NAME ?? '';

export const handler: APIGatewayProxyHandler = async (event) => {
    const todoId = event.pathParameters ? event.pathParameters.todoId : null;
    if (!todoId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing TODO ID in the path parameters." }),
            headers: { "Access-Control-Allow-Origin": "*" }
        };
    }

    try {
        const data = JSON.parse(event.body as string);
        const params = {
            TableName: TABLE_NAME,
            Key: {
                TodoID: todoId
            },
            UpdateExpression: "set Title = :t, Description = :d, Status = :s, UpdatedAt = :ua",
            ExpressionAttributeValues: {
                ":t": data.Title,
                ":d": data.Description,
                ":s": data.Status,
                ":ua": new Date().toISOString()
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
