import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TODO_TABLE_NAME || '';

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        // Optionally handle query parameters (e.g., specific TodoID)
        // const todoId = event.queryStringParameters ? event.queryStringParameters.todoId : null;

        // Set up the DynamoDB scan operation
        const params = {
            TableName: TABLE_NAME,
            // Add conditions here if querying for specific items
        };

        const data = await dynamoDb.scan(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to retrieve TODOs' }),
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        };
    }
};
