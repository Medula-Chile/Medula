const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const User = require('./models/User');

const createTestUser = async () => {
    try {
        // Primero intentemos listar las bases de datos disponibles
        const mongoClient = require('mongodb').MongoClient;
        const client = await mongoClient.connect(process.env.MONGO_URI);
        
        // Listar todas las bases de datos
        const adminDb = client.db('admin');
        const dbs = await adminDb.admin().listDatabases();
        console.log('\nBases de datos disponibles:');
        dbs.databases.forEach(db => {
            console.log(`- ${db.name} (${db.sizeOnDisk} bytes)`);
        });
        
        await client.close();

        // Ahora intentemos conectar con mongoose
        console.log('\nIntentando conectar con Mongoose...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        // Verificar la base de datos y colección actual
        const dbName = mongoose.connection.db.databaseName;
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Base de datos actual:', dbName);
        console.log('Colecciones en esta base de datos:', collections.map(c => c.name));
        console.log('Conectado a MongoDB Atlas');

        // Crear usuario de prueba
        const testUser = new User({
            nombre: "Ana Pérez",
            email: "ana@medula.cl",
            contraseña_hash: "hash123",
            rol: "paciente",
            rut: "12.345.678-9",
            fecha_registro: new Date(),
            estado: true
        });

        // Guardar el usuario
        await testUser.save();
        console.log('Usuario de prueba creado exitosamente');
        console.log('Datos del usuario:', testUser);

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        // Cerrar la conexión
        await mongoose.connection.close();
        console.log('Conexión cerrada');
    }
};

createTestUser();