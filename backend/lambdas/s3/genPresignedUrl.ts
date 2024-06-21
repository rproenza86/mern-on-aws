import { v4 as uuidv4 } from 'uuid';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client();
const bucketName = process.env.BUCKET_NAME || '';

export const handler: APIGatewayProxyHandler = async (event) => {
  const fileKey = uuidv4();
  const params = {
    Bucket: bucketName,
    Key: fileKey
  };

  const command = new PutObjectCommand(params);
  const presignedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

  return {
    statusCode: 200,
    body: JSON.stringify({
      presignedUrl,
      fileUrl: `https://${bucketName}.s3.amazonaws.com/${fileKey}`,
    }),
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
    }
  };
};