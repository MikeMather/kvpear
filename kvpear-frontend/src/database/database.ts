import mongoose from 'mongoose';

if (!process.env.DATABASE_URI) {
  throw new Error('Invalid environment variable: "DATABASE_URI"')
}

const uri = process.env.DATABASE_URI
const options = {}

let client
let dbClientPromise: Promise<typeof mongoose>

if (!process.env.DATABASE_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  // @ts-ignore
  if (!global._mongoClientPromise) {
    client = mongoose.connect(uri, options)
    // @ts-ignore
    global._mongoClientPromise = client
  }
  // @ts-ignore
  dbClientPromise = global._mongoClientPromise
  dbClientPromise.then(() => console.log("Connected to MongoDB"))
} else {
  // In production mode, it's best to not use a global variable.
  dbClientPromise = mongoose.connect(uri, options)
  dbClientPromise.then(() => console.log("Connected to MongoDB"))
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default dbClientPromise

export async function getDb() {
  return await dbClientPromise;
}