export const databaseName = "benefits-site";

const { MongoClient, ObjectId } = require("mongodb");

interface DocumentWithActive {
  isActive?: boolean; 
  [key: string]: any;
}

export async function connectDatabase() {
  const dbConnection: any = process.env.PUBLIC_DB_CONNECTION;
  return await MongoClient.connect(dbConnection);
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
    .updateOne({ _id: new ObjectId(id) }, { $set: { isActive: false } }); // Mark as inactive
  return result;
}

export async function getClientModeByEmailAndPassword(
  client: any,
  collection: string,
  email: string,
  password: string,
) {
  const db = client.db(databaseName);
  const clientMode = await db
    .collection(collection)
    .findOne({ email: email, password: password });
  return clientMode;
}
