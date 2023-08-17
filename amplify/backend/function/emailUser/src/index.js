/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	SES_EMAIL
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const aws = require("aws-sdk");
const ses = new aws.SES();

exports.handler = async (event) => {
  for (const record of event.Records) {
    if (record.eventName === "INSERT") {
      //pull off items from stream
      const userId = record.dynamodb.NewImage.userID.S;

      await ses
        .sendEmail({
          Destination: {
            ToAddresses: [process.env.SES_EMAIL],
          },
          Source: process.env.SES_EMAIL,
          Message: {
            Subject: { Data: "Booking Confirmation" },
            Body: {
              Text: {
                Data: `Test booking: You have confirmed a booking for ${userId}.`,
              },
            },
          },
        })
        .promise();
    }
  }
  return { status: "done" };
};
