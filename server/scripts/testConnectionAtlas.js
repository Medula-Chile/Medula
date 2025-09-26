// DEBE ser la PRIMERA línea del archivo
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');

console.log('🔍 Debug - Variables de entorno cargadas:');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ DEFINIDA' : '❌ UNDEFINED');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

// Si MONGO_URI está undefined, mostrar ayuda
if (!process.env.MONGO_URI) {
  console.log('\n❌ PROBLEMA DETECTADO: MONGO_URI no está definida');
  console.log('📋 Posibles soluciones:');
  console.log('   1. Verifica que el archivo .env esté en la raíz del proyecto');
  console.log('   2. Verifica que el archivo se llame EXACTAMENTE .env');
  console.log('   3. Verifica que MONGO_URI esté escrita correctamente en .env');
  console.log('   4. Reinicia el servidor después de modificar .env');
  process.exit(1);
}

const testAtlasConnection = async () => {
  try {
    console.log('\n🧪 Probando conexión con MongoDB Atlas...');
    console.log('📡 URI:', process.env.MONGO_URI.substring(0, 50) + '...'); // Muestra solo parte por seguridad
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conexión exitosa con MongoDB Atlas!');
    
    // Ver información de la base de datos
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📂 Colecciones encontradas: ${collections.length}`);
    
    await mongoose.connection.close();
    console.log('✅ Prueba completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en la conexión:');
    console.error('   Mensaje:', error.message);
    
    if (error.message.includes('bad auth')) {
      console.error('   🔑 Error de autenticación: verifica usuario y contraseña');
    } else if (error.message.includes('querySrv')) {
      console.error('   🌐 Error DNS: verifica la cadena de conexión de Atlas');
    }
    
    process.exit(1);
  }
};

testAtlasConnection();