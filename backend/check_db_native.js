require('dotenv').config();
const { MongoClient } = require('mongodb');

async function main() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('real'); // based on URI
    const properties = database.collection('properties');

    const total = await properties.countDocuments();
    const withCustomer = await properties.countDocuments({ createdBy: "Customer" });
    const withAdmin = await properties.countDocuments({ createdBy: "Admin" });
    const missing = await properties.countDocuments({ createdBy: { $exists: false } });

    require('fs').writeFileSync('db_native.txt', `Total: ${total}\nCustomer: ${withCustomer}\nAdmin: ${withAdmin}\nMissing: ${missing}`);
    
  } finally {
    await client.close();
  }
}
main().catch(console.error);
