import express from "express";
import startBot from "./config/bot/client.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.middlewares();
    this.routes();
    this.startWhatsAppBot();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`);
    });
  }

  middlewares() {
    this.app.use(express.json());
  }

  routes() {
  }

  async startWhatsAppBot() {
    await startBot();
  }
}

export default Server;
