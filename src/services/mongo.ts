export const databaseName = "benefits-site";

const { MongoClient, ObjectId } = require("mongodb");

export async function connectDatabase() {
  const dbConnection: any = process.env.PUBLIC_DB_CONNECTION;
  return await MongoClient.connect(dbConnection);
}

export async function insertDocument(
  client: any,
  collection: string,
  document: object
) {
  const db = client.db(databaseName);
  const result = await db.collection(collection).insertOne(document);
  return result;
}

export async function getAllDocuments(client: any, collection: string) {
  const db = client.db(databaseName);
  const documents = await db.collection(collection).find().toArray();
  return documents;
}

//id ==objectid?
export async function getDocumentById(
  client: any,
  collection: string,
  id: string
) {
  const db = client.db(databaseName);
  const document = await db
    .collection(collection)
    .findOne({ _id: ObjectId(id) });
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
    .updateOne({ _id: ObjectId(id) }, { $set: updatedDocument });
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
    .deleteOne({ _id: ObjectId(id) });
  return result;
}
