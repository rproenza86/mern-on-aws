import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
    // Your function logic here
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Hello from Lambda TypeScript!' }),
        headers: {
            'Content-Type': 'application/json',
      
            // 👇 allow CORS for all origins
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            'Access-Control-Allow-Headers':
              'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
            'Access-Control-Allow-Credentials': 'true', // Required for cookies, authorization headers with HTTPS
            'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
          },
    };
};


