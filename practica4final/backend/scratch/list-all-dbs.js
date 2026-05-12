import { MongoClient } from 'mongodb';

async function listDbs() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const dbs = await client.db().admin().listDatabases();
        console.log('Databases in cluster:');
        for (const dbInfo of dbs.databases) {
            console.log(` - ${dbInfo.name} (${dbInfo.sizeOnDisk} bytes)`);
            const db = client.db(dbInfo.name);
            const cols = await db.listCollections().toArray();
            for (const c of cols) {
                const count = await db.collection(c.name).countDocuments();
                if (count > 0) {
                    console.log(`    * ${c.name}: ${count}`);
                }
            }
        }
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.close();
    }
}
listDbs();
