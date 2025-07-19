import { MessageModel } from './message.model.js';
import { sendMessage } from '../../config/bot/client.js'; // ✅ para enviar mensajes desde la API

// Guarda mensaje en MongoDB
export async function saveMessage(userNumber, userMessage, botResponse) {
  try {
    const msg = new MessageModel({ userNumber, userMessage, botResponse });
    await msg.save();
  } catch (error) {
    console.error('❌ Error al guardar en MongoDB:', error.message);
  }
}

// Contador total de mensajes
export async function countMessages() {
  try {
    return await MessageModel.countDocuments();
  } catch (error) {
    console.error('❌ Error al contar mensajes:', error.message);
    return 0;
  }
}

// Obtener historial por número
export async function getAllMessagesByUser(userNumber) {
  try {
    return await MessageModel.find({ userNumber }).sort({ createdAt: 1 }).limit(20);
  } catch (error) {
    console.error('❌ Error al obtener historial:', error.message);
    return [];
  }
}

// Obtener todos los mensajes
export async function getMessagesAPI(req, res) {
  try {
    const messages = await MessageModel.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo todos los mensajes" });
  }
}

// Obtener mensajes por número
export async function getMessagesByUserAPI(req, res) {
  let { numero } = req.params;
  numero = numero.replace(/[^0-9]/g, ""); // limpia el número
  const numeroWhatsApp = `${numero}@s.whatsapp.net`;

  try {
    const mensajes = await MessageModel.find({ userNumber: numeroWhatsApp }).sort({ createdAt: 1 });
    res.json({ messages: mensajes });
  } catch (error) {
    console.error("❌ Error en getMessagesByUserAPI:", error.message);
    res.status(500).json({ error: "Error al obtener mensajes por número" });
  }
}

export async function sendMessageAPI(req, res) {
  console.log("entro a sendMeesageApi")
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: "Cuerpo de la petición inválido o vacío" });
  }

  const { number, message } = req.body;

  if (!number || !message) {
    return res.status(400).json({ error: "Faltan parámetros: number y message" });
  }

  try {
    await sendMessage(`${number}@s.whatsapp.net`, message);
    res.json({ status: "ok", to: number, message });
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error.message);
    res.status(500).json({ error: "Error enviando mensaje" });
  }
}
