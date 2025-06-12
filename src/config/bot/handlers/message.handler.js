import { handleColorRule } from "../rules/color.rule.js";

const handleIncomingMessage = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const text = msg.message?.conversation?.trim().toLowerCase();

  console.log(msg)

  if (!text) return;

  if (text === "hola") {
    await sock.sendMessage(from, {
      text: "Hola amigo, soy un bot, elige una opción:\n1.- rojo\n2.- azul\n3.- verde",
    });
    return;
  }

  if (["1", "2", "3"].includes(text)) {
    await handleColorRule(sock, from, text);
  }
};

export default handleIncomingMessage;
