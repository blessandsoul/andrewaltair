import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local or .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const OLD_URI = process.env.MONGODB_URI;
const NEW_URI = process.env.MONGODB_URI_NEW;

if (!OLD_URI) {
    console.error('❌ MONGODB_URI (Old DB) is missing in .env');
    process.exit(1);
}

if (!NEW_URI) {
    console.error('❌ MONGODB_URI_NEW (Coolify DB) is missing in .env');
    process.exit(1);
}

async function migrate() {
    console.log('🚀 Starting migration...');
    console.log('-----------------------------------');

    try {
        // 1. Connect to Old Database
        console.log('📡 Connecting to OLD database...');
        const oldConn = await mongoose.createConnection(OLD_URI).asPromise();
        console.log('✅ Connected to OLD database.');

        // 2. Connect to New Database
        console.log('📡 Connecting to NEW (Coolify) database...');
        const newConn = await mongoose.createConnection(NEW_URI).asPromise();
        console.log('✅ Connected to NEW database.');

        // 3. Get list of collections from Old DB
        const collections = await oldConn.db.listCollections().toArray();
        console.log(`\n📦 Found ${collections.length} collections to migrate.`);

        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;

            // Skip system collections if any
            if (collectionName.startsWith('system.')) continue;

            console.log(`\n🔄 Migrating collection: ${collectionName}`);

            // Get model/access to collection
            const OldModel = oldConn.collection(collectionName);
            const NewModel = newConn.collection(collectionName);

            // Fetch all documents
            const documents = await OldModel.find({}).toArray();
            const count = documents.length;

            if (count === 0) {
                console.log(`   🔸 Skipped (empty)`);
                continue;
            }

            console.log(`   📥 Reading ${count} documents...`);

            // Clear new collection before inserting (optional, but safer for re-runs)
            // await NewModel.deleteMany({}); 
            // safer to just try insert, or use bulkWrite with upsert if needed. 
            // For simple migration, let's just insert. If it exists, it might error on duplicate key.

            try {
                // We use bulkWrite for better error handling on duplicates
                const bulkOps = documents.map(doc => ({
                    replaceOne: {
                        filter: { _id: doc._id },
                        replacement: doc,
                        upsert: true
                    }
                }));

                await NewModel.bulkWrite(bulkOps);
                console.log(`   ✅ Successfully migrated ${count} documents.`);
            } catch (err) {
                console.error(`   ❌ Error migrating ${collectionName}:`, err);
            }
        }

        console.log('\n-----------------------------------');
        console.log('🎉 Migration finished successfully!');

        // Close connections
        await oldConn.close();
        await newConn.close();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Fatal Migration Error:', error);
        process.exit(1);
    }
}

migrate();
