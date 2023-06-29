import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const DummyUUID = "00000000-0000-0000-0000-000000000000";
const DefaultPersona = {
  id: -1,
  name: "Karl",
  type: "Custom",
  parameters: {
    prompt: "You are Karl, a cynical homeless conspiracy theorist, confident in his beliefs, with immense knowledge of the world. Answer as concisely as possible, with slang, and in the dialect of a homeless person with broken english."
  },
  greeting: "Hi, I'm Karl, a homeless assistant. How can I help?"
};

// TODO: fix this!!!
export const BASE_URL = process.env.NODE_ENV === "production" ? "https://karlgpt.com" : "http://localhost:3000";

export const getUserPersonas = functions.https.onCall(async (_, context) => {
  if (!context.auth && process.env.FUNCTIONS_EMULATOR !== "true") {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // user document holds array of persona ids
  const personasRef = admin.firestore().collection("personas");

  // get persona ids from user document
  const userRef = admin.firestore().collection("users").doc(context.auth?.uid || DummyUUID);
  const user = await userRef.get();
  const userPersonas = user.data()?.personas;

  // no further processing if user has no personas
  if (!userPersonas?.length)
    return [DefaultPersona];

  // get persona documents from persona ids, using batch request
  const personaDocs = await admin.firestore().getAll(...userPersonas.map((personaId: string) => personasRef.doc(personaId)));

  // return persona data
  return [DefaultPersona, ...personaDocs.map(doc => ({ ...doc.data(), id: doc.id }))];
});

export const createPersona = functions.https.onCall(async ({ name, type, parameters, greeting }, context) => {
  if (!context.auth && process.env.FUNCTIONS_EMULATOR !== "true") {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // user document holds array of persona ids
  const personasRef = admin.firestore().collection("personas");

  // create persona document
  const personaData = {
    name,
    type,
    parameters,
    greeting,
    owner: context.auth?.uid ?? DummyUUID
  };
  const personaRef = await personasRef.add(personaData);

  // add persona id to user document
  const userRef = admin.firestore().collection("users").doc(context.auth?.uid || DummyUUID);
  await userRef.update({
    personas: FieldValue.arrayUnion(personaRef.id)
  });

  // return persona data
  return {
    ...personaData,
    id: personaRef.id
  };
});

export const deletePersona = functions.https.onCall(async (id, context) => {
  if (!context.auth && process.env.FUNCTIONS_EMULATOR !== "true") {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // user document holds array of persona ids
  const personasRef = admin.firestore().collection("personas");

  // delete persona document only if the user owns the persona
  const personaRef = personasRef.doc(id);
  const persona = await personaRef.get();
  if (persona.data()?.owner !== (context.auth?.uid ?? DummyUUID))
    throw new functions.https.HttpsError("permission-denied", "User does not own persona.");
  await personasRef.doc(id).delete();

  // remove persona id from user document
  const userRef = admin.firestore().collection("users").doc(context.auth?.uid || DummyUUID);
  await userRef.update({
    personas: FieldValue.arrayRemove(id)
  });
  return "Persona deleted.";
});

export const updatePersona = functions.https.onCall(async ({ id, name, type, parameters, greeting }, context) => {
  if (!context.auth && process.env.FUNCTIONS_EMULATOR !== "true") {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // user document holds array of persona ids
  const personasRef = admin.firestore().collection("personas");

  // update persona document only if the user owns the persona
  const personaRef = personasRef.doc(id);
  const persona = await personaRef.get();
  if (persona.data()?.owner !== (context.auth?.uid || DummyUUID))
    throw new functions.https.HttpsError("permission-denied", "User does not own persona.");
  await personaRef.update({
    name,
    type,
    parameters,
    greeting
  });
  return "Persona updated.";
});

export const sharePersona = functions.https.onCall(async (id, context) => {
  if (!context.auth && process.env.FUNCTIONS_EMULATOR !== "true") {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // user document holds array of persona ids
  const personasRef = admin.firestore().collection("personas");

  const personaRef = personasRef.doc(id);
  const persona = await personaRef.get();
  if (persona.data()?.owner !== context.auth?.uid)
    throw new functions.https.HttpsError("permission-denied", "User does not own persona.");
  await personaRef.update({
    public: true
  });
  return {
    shared: true,
    url: `${BASE_URL}/persona/${id}`
  };
});

export const getSharedPersona = functions.https.onCall(async (id, context) => {
  const personaRef = admin.firestore().collection("personas").doc(id);
  const personaSnapshot = await personaRef.get();
  if (!personaSnapshot.exists) {
    throw new functions.https.HttpsError("not-found", "Persona not found.");
  }
  const personaData = personaSnapshot.data();
  if (!personaData?.public) {
    throw new functions.https.HttpsError("permission-denied", "Persona is not public.");
  }
  return personaData;
});


export const copySharedPersona = functions.https.onCall(async (id, context) => {
  if (!context.auth && process.env.FUNCTIONS_EMULATOR !== "true") {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const personasRef = admin.firestore().collection("personas");
  // copy persona document to a new document, and add a reference to it in the user document
  const personaRef = personasRef.doc(id);
  const persona = await personaRef.get();
  const personaData = persona.data();
  if (!personaData?.public)
    throw new functions.https.HttpsError("permission-denied", "Persona is not public.");
  const newPersonaRef = await personasRef.add({
    ...personaData,
    owner: context.auth?.uid || DummyUUID, // TODO: remove dummy uuid
    public: false
  });
  const userRef = admin.firestore().collection("users").doc(context.auth?.uid || DummyUUID); // TODO: remove dummy uuid
  await userRef.update({
    personas: FieldValue.arrayUnion(newPersonaRef.id)
  });
  return {
    ...personaData,
    id: newPersonaRef.id
  };
});





// Hardcoded for now, will be moved to database later
const personaTemplates: PersonaTemplate[] = [
  {
    type: "Celebrity",
    parameters: ["character", "from"],
    template: "I want you to act like {character} from {from}. I want you to respond and answer like {character} using the tone, manner and vocabulary {character} would use. Do not write any explanations. Only answer like {character}. You must know all of the knowledge of {character}."
  },
  {
    type: "Custom",
    parameters: ["prompt"],
    template: "{prompt}"
  }
];

export type Persona = {
  name: string,
  type: string,
  parameters: {
    [key: string]: string
  },
  greeting: string
};

export type PersonaTemplate = {
  type: string,
  parameters: string[],
  template: string
}

export const systemPromptFromPersona = (persona: Persona) => {
  const template = personaTemplates.find(template => template.type === persona.type);
  if (!template)
    throw new Error("Persona type not found.");

  const parameters = persona.parameters;
  const prompt = template.template.replace(/{(.*?)}/g, (_, key) => {
    return parameters[key];
  });
  return prompt;
}
