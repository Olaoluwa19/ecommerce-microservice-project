import { S3 } from "aws-sdk";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 as uuid } from "uuid";
import { BadRequest, NotFound } from "./utility/response";

const S3Client = new S3();

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  // grab filename from queryString
  const file = event.queryStringParameters?.file;
  if (!file) return BadRequest("File query parameter is required");

  // give uniquename of the file
  const filename = `${uuid()}__${file}`;

  // create S3Params
  const s3Params = {
    Bucket: process.env.BUCKET_NAME,
    key: filename,
    ContentType: "image/jpeg",
  };

  // get Signed URL
  const url = await S3Client.getSignedUrlPromise("putObject", s3Params);
  console.log("UPLOAD URL:", s3Params, url);

  // give it back to client for up;oad imaage

  return {
    statusCode: 200,
    body: JSON.stringify({
      url,
      key: filename,
    }),
  };
};
