import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export async function connectToMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
  }

  mongoose.connection.on('connected', () => {
    console.log('🟢 Conexión a MongoDB establecida');
  });

  mongoose.connection.on('error', (err) => {
    console.error('🔴 Error de conexión a MongoDB:', err);
  });
}
