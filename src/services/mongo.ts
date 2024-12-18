"use server";
import { UserGoogleFormValues, DocumentWithActive } from "@/types/types";

const databaseName = "benefits-site";

import { MongoClient, ObjectId } from "mongodb";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

export async function connectDatabase() {
  if (!client) {
    const dbConnectionString = process.env.PUBLIC_DB_CONNECTION;
    if (!dbConnectionString) {
      throw new Error("Database connection string is not defined");
    }
    client = new MongoClient(dbConnectionString);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function insertDocument(
  client: any,
  collection: string,
  document: DocumentWithActive
) {
  const db = client.db(databaseName);
  if (document.isActive === undefined) {
    document.isActive = true;
  }
  const result = await db.collection(collection).insertOne(document);

  return result;
}

export async function getAllDocuments(client: any, collection: string) {
  const db = client.db(databaseName);
  const documents = await db
    .collection(collection)
    .find({ isActive: true })
    .toArray();
  return documents;
}

export async function getDocumentById(
  client: any,
  collection: string,
  id: string
) {
  const db = client.db(databaseName);
  const document = await db
    .collection(collection)
    .findOne({ _id: new ObjectId(id), isActive: true });
  return document;
}

export async function updateDocumentById(
  client: any,
  collection: string,
  id: string,
  updatedDocument: object
) {
  const db = client.db(databaseName);
  const result = await db
    .collection(collection)
    .updateOne({ _id: new ObjectId(id) }, { $set: updatedDocument });
  return result;
}

export async function deleteDocumentById(
  client: any,
  collection: string,
  id: string
) {
  const db = client.db(databaseName);
  const result = await db
    .collection(collection)
    .updateOne({ _id: new ObjectId(id) }, { $set: { isActive: false } });
  return result;
}

export async function getClientModeByEmailAndPassword(
  client: any,
  collection: string,
  email: string,
  password: string
) {
  const db = client.db(databaseName);
  const clientMode = await db
    .collection(collection)
    .findOne({ email: email, password: password });
  return clientMode;
}

export async function findOrCreateUser({
  email,
  name,
}: {
  email: string;
  name?: string;
}) {
  let client = await connectDatabase();
  const db = client.db("benefits-site");
  const existingUser = await db
    .collection("users_collection")
    .findOne({ email });
  if (existingUser) {
    return existingUser;
  }

  const newUser: UserGoogleFormValues = {
    username: name || "Anonymous Google User",
    email,
    password: null,
    city: null,
    isActive: true,
    clubs: [],
    savedBenefits: [],
    registrationDate: new Date().toISOString(),
  };

  const result = await db.collection("users_collection").insertOne(newUser);

  return { ...newUser, _id: result.insertedId.toString() };
}
