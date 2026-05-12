import { MongoClient } from 'mongodb';

async function checkMongo() {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB_NAME || 'electoral_rrv';
    
    if (!uri) {
        console.error('MONGO_URI no definida en el env');
        return;
    }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        const actas = await db.collection('actas').countDocuments();
        const logs = await db.collection('logs_pipeline').countDocuments();
        console.log('--- MONGO COUNTS ---');
        console.log('ACTAS (RRV):', actas);
        console.log('LOGS:', logs);
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.close();
    }
}
checkMongo();
