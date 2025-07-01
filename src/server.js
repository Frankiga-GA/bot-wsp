import express from "express";
import dotenv from "dotenv";
import startBot from "./config/bot/client.js";
import { connectToMongo } from "./config/mongodb/connection.js";
import { countMessages, getMessagesAPI, getMessagesByUserAPI } from "./modules/shared/message.controller.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// ✅ Debe estar aquí, arriba de la clase
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.middlewares();
    this.routes();
    this.init();
  }

  async init() {
    await connectToMongo();
    const total = await countMessages();
    console.log(`📊 Mensajes registrados en MongoDB: ${total}`);
    await this.startWhatsAppBot();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`);
    });
  }

  middlewares() {
    this.app.use(express.json());

    // ✅ Usamos correctamente __dirname
    const publicPath = path.join(__dirname, "../public");
    this.app.use(express.static(publicPath));
    console.log("🟢 Sirviendo public desde:", publicPath);
  }

routes() {
  this.app.get("/", (_, res) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
  });

  this.app.get("/api/messages", getMessagesAPI); // <-- esta línea es clave
  this.app.get("/api/messages/:numero", getMessagesByUserAPI);
}


  async startWhatsAppBot() {
    await startBot();
  }
}

export default Server;
