import { MessageModel } from './message.model.js';

export async function saveMessage(userNumber, userMessage, botResponse) {
  try {
    const msg = new MessageModel({ userNumber, userMessage, botResponse });
    await msg.save();
  } catch (error) {
    console.error('❌ Error al guardar en MongoDB:', error.message);
  }
}

export async function countMessages() {
  try {
    return await MessageModel.countDocuments();
  } catch (error) {
    console.error('❌ Error al contar mensajes:', error.message);
    return 0;
  }
}

export async function getAllMessagesByUser(userNumber) {
  try {
    return await MessageModel.find({ userNumber }).sort({ createdAt: 1 }).limit(20);
  } catch (error) {
    console.error('❌ Error al obtener historial:', error.message);
    return [];
  }
}
