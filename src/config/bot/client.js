import baileys from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import P from "pino";
import handleIncomingMessage from "./handlers/message.handler.js";

const makeWASocket = baileys.default;
const { useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } =
  baileys;

const startBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(
    "./src/config/bot/auth"
  );
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: "silent" }),
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("🔐 Escanea el siguiente código QR para conectar:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;

      console.log(
        "❌ Conexión cerrada:",
        lastDisconnect?.error,
        "| ¿Reconectar?:",
        shouldReconnect
      );

      if (shouldReconnect) startBot();
    }

    if (connection === "open") {
      console.log("✅ Bot conectado a WhatsApp");

      const wid = sock.user.id;
      console.log("🤖 Número vinculado del bot:", wid);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type === "notify") {
      const msg = messages[0];
      console.log('📥 Mensaje recibido:', msg);
      if (!msg.key.fromMe && msg.message) {
        await handleIncomingMessage(sock, msg);
      }
    }
  });
};

export default startBot;
