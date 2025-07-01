import { askLLM } from "../../../services/LLM/index.js";
import { saveMessage, getAllMessagesByUser } from "../../../modules/shared/message.controller.js";

const handleIncomingMessage = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const text = msg.message?.conversation?.trim();
  if (!text) return;

  // Obtener historial de mensajes del usuario
  const historial = await getAllMessagesByUser(from);

  // Convertir historial a texto concatenado
  const contexto = historial
    .map(m => `🧑: ${m.userMessage}\n🤖: ${m.botResponse}`)
    .join('\n');

  const promptFinal = `${contexto}\n🧑: ${text}`;

  const respuesta = await askLLM(promptFinal);

  await saveMessage(from, text, respuesta);

  await sock.sendMessage(from, { text: respuesta });
};

export default handleIncomingMessage;
