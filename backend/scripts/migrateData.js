require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

const OLD_URI = process.env.OLD_MONGO_URI;
const NEW_URI = process.env.NEW_MONGO_URI;

const collectionsToCopy = [
  "blogs",
  "contacts",
  "enquiries",
  "properties",
  "users",
];

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function makeUniqueSlug(baseSlug, usedSlugs, fallbackId) {
  let slug = baseSlug && baseSlug !== "null" ? baseSlug : `property-${fallbackId}`;
  let uniqueSlug = slug;
  let count = 1;

  while (usedSlugs.has(uniqueSlug)) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  usedSlugs.add(uniqueSlug);
  return uniqueSlug;
}

async function migrate() {
  const oldClient = new MongoClient(OLD_URI);
  const newClient = new MongoClient(NEW_URI);

  try {
    await oldClient.connect();
    await newClient.connect();

    console.log("✅ Old DB connected");
    console.log("✅ New DB connected");

    const oldDb = oldClient.db("real");
    const newDb = newClient.db("sr3group");

    for (const collectionName of collectionsToCopy) {
      const oldCollection = oldDb.collection(collectionName);
      const newCollection = newDb.collection(collectionName);

      let docs = await oldCollection.find({}).toArray();

      console.log(`\n📦 ${collectionName}: ${docs.length} documents found`);

      if (!docs.length) {
        console.log(`⚠️ No documents in ${collectionName}, skipped`);
        continue;
      }

      await newCollection.deleteMany({});
      console.log(`🗑 Cleared old data from ${collectionName}`);

      // Special handling for properties collection
      if (collectionName === "properties") {
        const usedSlugs = new Set();

        docs = docs.map((doc, index) => {
          const fallbackId =
            doc._id?.toString?.() || new ObjectId().toString();

          const baseText =
            doc.slug ||
            doc.title ||
            doc.name ||
            doc.propertyTitle ||
            doc.location ||
            `property-${index + 1}`;

          const cleanBaseSlug = slugify(baseText);
          const finalSlug = makeUniqueSlug(cleanBaseSlug, usedSlugs, fallbackId);

          return {
            ...doc,
            slug: finalSlug,
          };
        });

        console.log("🔧 Fixed missing/duplicate slugs in properties");
      }

      await newCollection.insertMany(docs, { ordered: false });
      console.log(`✅ Imported ${docs.length} docs into ${collectionName}`);
    }

    console.log("\n🎉 Data migration completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await oldClient.close();
    await newClient.close();
    process.exit();
  }
}

migrate();