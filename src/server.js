import express from "express";
import dotenv from "dotenv";
import startBot from "./config/bot/client.js";
import { connectToMongo } from "./config/mongodb/connection.js";
import { countMessages } from "./modules/shared/message.controller.js";

dotenv.config();

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
  }

  routes() {}

  async startWhatsAppBot() {
    await startBot();
  }
}

export default Server;
