import { MongoClient } from 'mongodb';

async function checkMongo() {
    const uri = 'mongodb+srv://almendrassamuel667_db_user:iRvYRkrKFerm6fW9@cluster0.dzwxwhk.mongodb.net/';
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('electoral_rrv');
        const count = await db.collection('actas_rrv').countDocuments();
        console.log('MONGO_ACTAS_RRV_COUNT:', count);
        
        const errores = await db.collection('logs_rrv').find().sort({timestamp: -1}).limit(2).toArray();
        console.log('ULTIMOS_LOGS_RRV:', JSON.stringify(errores, null, 2));
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.close();
    }
}
checkMongo();
