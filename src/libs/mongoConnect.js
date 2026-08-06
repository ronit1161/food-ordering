import { MongoClient } from "mongodb";

const uri = process.env.NEXT_MONGO_URL;
let clientPromise;

if (uri) {
  const client = new MongoClient(uri);

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so MongoClient is not constantly recreated on every refresh.
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    clientPromise = client.connect();
  }
} else {
  // Fallback to resolve build-time validation without crashing
  clientPromise = Promise.resolve(null);
}

export default clientPromise;
