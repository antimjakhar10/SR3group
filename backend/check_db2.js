require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/Property');
const fs = require('fs');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const props = await Property.find();
  const adminProps = props.filter(p => p.createdBy === 'Admin').length;
  const custProps = props.filter(p => p.createdBy === 'Customer').length;
  const missing = props.filter(p => !['Admin', 'Customer'].includes(p.createdBy)).length;
  
  const stats = `Total: ${props.length}\nAdmin: ${adminProps}, Customer: ${custProps}, Missing: ${missing}`;
  fs.writeFileSync('db_stats.txt', stats);
  process.exit(0);
}).catch(console.error);
