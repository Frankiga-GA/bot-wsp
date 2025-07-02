import { askLLM } from "../../../services/LLM/index.js";
import { saveMessage, getAllMessagesByUser } from "../../../modules/shared/message.controller.js";
import axios from "axios";

const handleIncomingMessage = async (sock, msg) => {
  const from = msg.key.remoteJid; // Ej: "51987156634@s.whatsapp.net"
  const userNumber = from.replace('@s.whatsapp.net', ''); // Solo deja "51987156634"
  const text = msg.message?.conversation?.trim();
  if (!text) return;

  const historial = await getAllMessagesByUser(userNumber);

  const contexto = historial
    .map(m => `🧑: ${m.userMessage}\n🤖: ${m.botResponse}`)
    .join('\n');

  const promptFinal = `${contexto}\n🧑: ${text}`;

  const respuesta = await askLLM(promptFinal);

  await saveMessage(userNumber, text, respuesta);

  // 🔗 Enviar al webhook de n8n
  await axios.post("https://walrus-delicate-routinely.ngrok-free.app/webhook-test/nuevo-mensaje", {
    userNumber,
    userMessage: text,
    botResponse: respuesta
  });

  await sock.sendMessage(from, { text: respuesta });
};

export default handleIncomingMessage;
