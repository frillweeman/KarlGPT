import * as functions from 'firebase-functions';
import { OpenAIApi, Configuration } from "openai";
import * as dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

// POST route for getting an automated chat response given a list of existing messages
export const getResponse = functions.https.onCall(async ({ messages }, context) => {
  const systemMessage = {
    "role": "system",
    "content": `You are KarlGPT, a large language model trained by KarlAI. Answer as concisely as possible. Knowledge cutoff: 2021 Current date: ${(new Date()).toISOString()}`
  };
  const { data } = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [systemMessage, ...messages],
  });
  return data.choices[0].message;
});
