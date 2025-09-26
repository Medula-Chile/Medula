const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log(' Conectando a MongoDB Atlas...');
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    console.log('\n=== Conexión MongoDB Atlas ===');
    console.log('✅ Estado: Conectado exitosamente');
    console.log(`📁 Base de datos: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`🔌 Puerto: ${conn.connection.port}`);
    console.log('============================\n');
    
  } catch (error) {
    console.error(' Error conectando a MongoDB Atlas:');
    console.error('   - Verifica tu cadena de conexión en .env');
    console.error('   - Revisa tu usuario y contraseña de Atlas');
    console.error('   - Verifica la whitelist de IPs en Atlas');
    console.error('   - Error detallado:', error.message);
    process.exit(1);
  }
};

// Eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose: Conexión establecida');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose: Conexión terminada');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose: Error de conexión:', err.message);
});

// Manejo de cierre de la aplicación
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 Mongoose: Conexión cerrada por terminación de la aplicación');
  process.exit(0);
});

module.exports = connectDB;