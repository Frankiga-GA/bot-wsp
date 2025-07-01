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


export async function getMessagesAPI(req, res) {
  try {
    const messages = await MessageModel.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo todos los mensajes" });
  }
}


export async function getMessagesByUserAPI(req, res) {
  let { numero } = req.params;

  // 🧼 Limpia el número: solo dígitos
  numero = numero.replace(/[^0-9]/g, "");

  // 🧩 Agrega el sufijo para buscar en Mongo
  const numeroWhatsApp = `${numero}@s.whatsapp.net`;

  try {
    const mensajes = await MessageModel.find({ userNumber: numeroWhatsApp }).sort({ createdAt: 1 });
    res.json({ messages: mensajes });
  } catch (error) {
    console.error("❌ Error en getMessagesByUserAPI:", error.message);
    res.status(500).json({ error: "Error al obtener mensajes por número" });
  }
}
