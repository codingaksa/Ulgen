/*
  Dev utility: Ensure only TTL index exists on invites.expiresAt
*/
const mongoose = require("mongoose");

async function main() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ulgen";
  await mongoose.connect(mongoUri);
  const coll = mongoose.connection.db.collection("invites");
  const indexes = await coll.listIndexes().toArray();
  const expiresIndexes = indexes.filter(
    (ix) => ix.key && ix.key.expiresAt === 1
  );
  console.log(
    "Current invites indexes:",
    indexes.map((i) => ({
      name: i.name,
      key: i.key,
      expireAfterSeconds: i.expireAfterSeconds,
    }))
  );
  // Keep TTL index (has expireAfterSeconds). Drop any non-TTL index on expiresAt
  for (const ix of expiresIndexes) {
    if (typeof ix.expireAfterSeconds !== "number") {
      console.log("Dropping non-TTL expiresAt index:", ix.name);
      await coll
        .dropIndex(ix.name)
        .catch((e) => console.error("dropIndex error:", e.message));
    }
  }
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
