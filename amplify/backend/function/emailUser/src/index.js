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

/**
 * AWS Lambda function. Sends an email to the admin and user every time a
 * booking is confirmed.
 */
exports.handler = async (event) => {
  for (const record of event.Records) {
    if (record.eventName === "INSERT") {
      const userEmail = record.dynamodb.NewImage.title.S;
      const description = record.dynamodb.NewImage.description.S;

      try {
        await ses
          .sendEmail({
            Destination: {
              ToAddresses: [process.env.SES_EMAIL],
            },
            Source: process.env.SES_EMAIL,
            Message: {
              Subject: {
                Data: "Partners in Equestrian Therapy - Booking Confirmation",
              },
              Body: {
                Text: {
                  Data: `${description}`,
                },
              },
            },
          })
          .promise();
      } catch (err) {
        return { error: err };
      }
    }
  }
  return { status: "done" };
};
