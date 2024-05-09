import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TODO_TABLE_NAME ?? '';

export interface TodoItem {
    Title: string;
    Description: string;
    Status?: string; // Optional because a default value is set if not provided
}

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const data = JSON.parse(event.body as string) as TodoItem;
        const todoID =  uuidv4()
        const todoItem = {
            TableName: TABLE_NAME,
            Item: {
                TodoID: todoID,
                Title: data.Title,
                Description: data.Description,
                Status: data.Status ?? 'pending', // Default status
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),
            }
        };

        await dynamoDb.put(todoItem).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'TODO created successfully',
                todoId: todoID
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
            }
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to create TODO' }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
            }
        };
    }
};