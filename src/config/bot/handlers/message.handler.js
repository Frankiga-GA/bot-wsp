import { askLLM } from "../../../services/LLM/index.js";

const handleIncomingMessage = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const text = msg.message?.conversation?.trim();

  if (!text) return;

  // comandos especificos
  if (text.toLowerCase() === "ayuda") {
    await sock.sendMessage(from, {
      text: "📌 Soy un bot inteligente. Solo escribe tu consulta y te responderé.",
    });
    return;
  }

  // Interacciòn directa con el bot
  const respuesta = await askLLM(text);
  await sock.sendMessage(from, { text: respuesta });
};

export default handleIncomingMessage;
