/*
 Script: hash-legacy-passwords.js
 Purpose: Migrate users whose contraseña_hash is not a bcrypt hash to a secure bcrypt hash.
 Strategy: If contraseña_hash does not start with "$2", we will treat the existing value as the current plaintext password
           and replace it with bcrypt.hash(contraseña_hash, 10). This preserves the same password for the user.
 Usage:
   NODE_OPTIONS=--no-deprecation node server/scripts/hash-legacy-passwords.js
 Requirements:
   - MONGO_URI in server/.env or environment
   - JWT_SECRET not required for this script
*/

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

function isBcryptHash(value) {
  return typeof value === 'string' && value.startsWith('$2');
}

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('❌ MONGO_URI no definido. Configure server/.env');
    process.exit(1);
  }

  console.log('🔌 Conectando a MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('✅ Conectado');

  try {
    const users = await User.find({}, 'email contraseña_hash rol nombre');
    let total = users.length;
    let updated = 0;

    for (const u of users) {
      const hash = u.contraseña_hash;
      if (!hash || !isBcryptHash(hash)) {
        const plaintext = hash || '';
        if (!plaintext) {
          // Si no hay valor, establecemos una contraseña temporal segura
          // y la hasheamos. Puede comunicarse a los usuarios si aplica.
          const temp = 'Medula123!';
          u.contraseña_hash = await bcrypt.hash(temp, 10);
          console.log(`  • ${u.email}: contraseña vacía -> asignada temporal`);
        } else {
          u.contraseña_hash = await bcrypt.hash(plaintext, 10);
          console.log(`  • ${u.email}: migrada manteniendo su contraseña actual`);
        }
        await u.save();
        updated++;
      }
    }

    console.log(`\n📊 Usuarios totales: ${total}`);
    console.log(`🔒 Usuarios migrados a bcrypt: ${updated}`);
    console.log('✅ Migración completada.');
  } catch (err) {
    console.error('💥 Error durante la migración:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

main();
