import { askLLM } from "../../../services/LLM/index.js";
import { saveMessage, getAllMessagesByUser } from "../../../modules/shared/message.controller.js";

const handleIncomingMessage = async (sock, msg) => {
  const from = msg.key.remoteJid; // Ej: "51987156634@s.whatsapp.net"
  const userNumber = from.replace('@s.whatsapp.net', ''); // Solo deja "51987156634"
  const text = msg.message?.conversation?.trim();
  if (!text) return;

  // Obtener historial de mensajes del usuario
  const historial = await getAllMessagesByUser(userNumber);

  // Convertir historial a texto concatenado
  const contexto = historial
    .map(m => `🧑: ${m.userMessage}\n🤖: ${m.botResponse}`)
    .join('\n');

  const promptFinal = `${contexto}\n🧑: ${text}`;

  const respuesta = await askLLM(promptFinal);

  await saveMessage(userNumber, text, respuesta); // Guarda número limpio

  await sock.sendMessage(from, { text: respuesta });
};

export default handleIncomingMessage;
