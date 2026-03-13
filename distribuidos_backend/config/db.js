const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            tls: true,
            serverSelectionTimeoutMS: 15000,
        });
        console.log('✅ Conectado a MongoDB Atlas');
    } catch (err) {
        console.error('❌ Error en DB:', err.message);
        process.exit(1);
    }
};

module.exports = conectarDB;