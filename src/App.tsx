/* eslint-disable */
import React from "react";
import "./App.css";
import { Amplify } from "aws-amplify";

Amplify.configure({    
  "aws_project_region": "us-west-2",
  "aws_appsync_graphqlEndpoint": "https://fpocjay2u5enpc67hctcdnv2dm.appsync-api.us-west-2.amazonaws.com/graphql",
  "aws_appsync_region": "us-west-2",
  "aws_appsync_authenticationType": "API_KEY",
  "aws_appsync_apiKey": "da2-p7fhwsjzs5emfb2ywcwfz6zpfy",
  "aws_cognito_identity_pool_id": "us-west-2:cb4581b7-fde8-4f95-a36b-e84aba0704d3",
  "aws_cognito_region": "us-west-2",
  "aws_user_pools_id": "us-west-2_Xh6vCt2fx",
  "aws_user_pools_web_client_id": "5pgli3j4pt33t4knhmrj3b89m1",
  "oauth": {},
  "aws_cognito_username_attributes": [
      "EMAIL"
  ],
  "aws_cognito_social_providers": [],
  "aws_cognito_signup_attributes": [
      "EMAIL",
      "GIVEN_NAME",
      "FAMILY_NAME",
      "PHONE_NUMBER"
  ],
  "aws_cognito_mfa_configuration": "OFF",
  "aws_cognito_mfa_types": [
      "SMS"
  ],
  "aws_cognito_password_protection_settings": {
      "passwordPolicyMinLength": 8,
      "passwordPolicyCharacters": [
          "REQUIRES_LOWERCASE",
          "REQUIRES_NUMBERS",
          "REQUIRES_SYMBOLS",
          "REQUIRES_UPPERCASE"
      ]
  },
  "aws_cognito_verification_mechanisms": [
      "EMAIL"
  ]
});

function App() {
  return <p>Cleanedup React App</p>;
}

export default App;
