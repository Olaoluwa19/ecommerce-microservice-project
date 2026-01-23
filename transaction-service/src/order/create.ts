import { SQSEvent } from "aws-lambda";

export const handler = async (event: SQSEvent) => {
  console.log("SNS Topic Listeneer through SQS Queue - Order Create");
  console.log(event);

  return {
    statusCode: 200,
    body: JSON.stringify("Listening to Queue for Order Create"),
  };
};
