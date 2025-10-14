const mongoose = require('mongoose');
require('dotenv').config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  });

const Usuario = require('../models/User');

// Función para generar un RUT chileno válido
function generarRUTChileno() {
  const numero = Math.floor(Math.random() * 24000000) + 5000000; // Entre 5M y 29M
  let suma = 0;
  let multiplo = 2;
  
  // Calcular dígito verificador
  let rutStr = numero.toString();
  for (let i = rutStr.length - 1; i >= 0; i--) {
    suma += parseInt(rutStr[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  
  const resto = suma % 11;
  const dv = 11 - resto;
  let dvFinal;
  
  if (dv === 11) dvFinal = '0';
  else if (dv === 10) dvFinal = 'K';
  else dvFinal = dv.toString();
  
  return `${numero}-${dvFinal}`;
}

async function agregarRUTs() {
  try {
    console.log('🔍 Buscando usuarios sin RUT...');
    
    // Buscar usuarios sin RUT o con RUT vacío
    const usuariosSinRUT = await Usuario.find({
      $or: [
        { rut: { $exists: false } },
        { rut: null },
        { rut: '' }
      ]
    });
    
    console.log(`📊 Encontrados ${usuariosSinRUT.length} usuarios sin RUT`);
    
    if (usuariosSinRUT.length === 0) {
      console.log('✅ Todos los usuarios ya tienen RUT');
      process.exit(0);
    }
    
    let actualizados = 0;
    let errores = 0;
    
    for (const usuario of usuariosSinRUT) {
      try {
        let rutGenerado;
        let rutExiste = true;
        
        // Generar RUT único
        while (rutExiste) {
          rutGenerado = generarRUTChileno();
          const existe = await Usuario.findOne({ rut: rutGenerado });
          rutExiste = existe !== null;
        }
        
        // Actualizar usuario
        usuario.rut = rutGenerado;
        await usuario.save();
        
        console.log(`✅ Usuario ${usuario.nombre} (${usuario.email}) - RUT asignado: ${rutGenerado}`);
        actualizados++;
      } catch (error) {
        console.error(`❌ Error actualizando usuario ${usuario.email}:`, error.message);
        errores++;
      }
    }
    
    console.log('\n📊 Resumen:');
    console.log(`   ✅ Actualizados: ${actualizados}`);
    console.log(`   ❌ Errores: ${errores}`);
    console.log(`   📝 Total procesados: ${usuariosSinRUT.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el proceso:', error);
    process.exit(1);
  }
}

// Ejecutar
agregarRUTs();
