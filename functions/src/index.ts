import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { OpenAIApi, Configuration } from "openai";
import * as dotenv from 'dotenv';
import { systemPromptFromPersona } from './persona';

dotenv.config();
admin.initializeApp();
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

// POST route for getting an automated chat response given a list of existing messages
export const getResponse = functions.https.onCall(async ({ messages, persona }, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const systemMessage = {
    "role": "system",
    "content": systemPromptFromPersona(persona)
  };
  const { data } = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [systemMessage, ...messages]
  });
  return data.choices[0].message;
});

// Called the first time login is attempted, returns 200 if authenticated, 401 if not. Awaits manual authorization from admin via Firebase console.
export const login = functions.https.onCall(async ({ uid, name }, context) => {
  const userRef = admin.firestore().collection("users").doc(uid);
  const user = await userRef.get();
  if (user.exists) {
    const userIsAuthorized = user.data()?.isAuthorized;
    if (userIsAuthorized)
      return user.data();
    else
      throw new functions.https.HttpsError("unauthenticated", "User is not authorized.");
  } else {
    await userRef.set({ name, isAuthorized: false });
    return { name, isAuthorized: false };
  }
});

export * from './persona';
