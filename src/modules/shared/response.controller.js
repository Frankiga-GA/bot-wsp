import { sendMessage } from "../../config/bot/client.js";



export const handleBotResponse = async (req, res) => {
  const { number, message } = req.body;

  if (!number || !message) {
    return res.status(400).json({ error: "Faltan datos: número o mensaje" });
  }

  try {
    await sendMessage(number, message);
    res.status(200).json({ success: true, sent: true });
  } catch (error) {
    console.error("❌ Error enviando mensaje:", error);
    res.status(500).json({ success: false, error: "No se pudo enviar el mensaje" });
  }
};
