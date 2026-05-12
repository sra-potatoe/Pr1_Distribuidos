import pg from 'pg';
const { Client } = pg;

async function check() {
    const client = new Client({
        connectionString: 'postgresql://postgres:123@127.0.0.1:5432/electoral_oficial'
    });
    try {
        await client.connect();
        const res = await client.query('SELECT count(*) FROM votos_oficiales');
        console.log('COUNT_OFICIAL:', res.rows[0].count);
        
        const logs = await client.query('SELECT * FROM logs_oficial ORDER BY timestamp DESC LIMIT 20');
        console.log('ULTIMOS_LOGS:', JSON.stringify(logs.rows, null, 2));
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.end();
    }
}
check();
