import { MongoClient } from 'mongodb';

async function listCollections() {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB_NAME || 'electoral_rrv';
    
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        console.log('Collections in', dbName, ':', collections.map(c => c.name));
        
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(` - ${col.name}: ${count}`);
        }
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.close();
    }
}
listCollections();
