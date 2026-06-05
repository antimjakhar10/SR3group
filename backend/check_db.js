const mongoose = require('mongoose');
const Property = require('./models/Property');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const props = await Property.find();
  console.log(`Total Properties: ${props.length}`);
  
  const creators = {};
  const statuses = {};
  
  props.forEach(p => {
    const creator = p.createdBy || 'undefined';
    const status = p.approvalStatus || 'undefined';
    creators[creator] = (creators[creator] || 0) + 1;
    statuses[status] = (statuses[status] || 0) + 1;
  });
  
  console.log("Creators:", creators);
  console.log("Statuses:", statuses);
  
  process.exit(0);
}).catch(console.error);
