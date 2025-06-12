import venom from "venom-bot";
import handleIncomingMessage from "./handlers/message.handler.js";

const startBot = async () => {
  try {
    const client = await venom.create();
    client.onMessage(async (message) => {
      await handleIncomingMessage(client, message);
    });
    console.log("🤖 WhatsApp bot is ready!");
  } catch (error) {
    console.error("❌ Failed to start WhatsApp bot:", error);
  }
};

export default startBot;
