const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/realestate').then(async () => {
  const db = mongoose.connection.db;
  const result = await db.collection('properties').updateMany(
    { createdBy: { $nin: ['Admin', 'Customer'] } },
    { $set: { createdBy: 'Admin' } }
  );
  console.log('Updated properties to Admin:', result.modifiedCount);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
