import { createServer, Server } from "http";
import * as express from "express";
import * as path from "path";
import * as socketIo from "socket.io";

const maxMessages = 10;

export class AppServer {
  private app: express.Application;
  private io: SocketIO.Server;
  private base: string;
  private port: string | number;
  private server: Server;
  private messages: any = [];
  private count: number = maxMessages;

  constructor(base = "/../../client-angular/dist", port = 4300) {
    this.base = base;
    this.port = process.env.PORT || port;
    this.createApp();
    this.createServer();
    this.routes();
    this.listen();
    this.createMessages();
    this.sockets();
  }

  private createApp(): void {
    this.app = express();
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  private routes(): void {
    const staticOptions = {
      maxAge: 0
    };
    const router = express.Router();
    router.get("/", (req, res, next) => {
      res.sendFile(path.join(__dirname + this.base + "/index.html"));
    });
    this.app.use("/", express.static(path.join(__dirname, this.base), staticOptions));
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });
  }

  private sockets(): void {
    const _ = this;
    _.io = socketIo(_.server);

    _.io.on("connect", (socket: any) => {
      console.log("User connected on port %s.", _.port);
      socket.on("add-message", (message: string) => {
        console.log("server: %s", JSON.stringify(message));
        _.io.emit("message", JSON.stringify([_.generateMessage("Owl", message)]));
      });
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });

      _.io.emit("message", JSON.stringify(_.messages));
    });
  }

  private createMessages(): void {
    let time: any = new Date();
    for (let i = 0; i < maxMessages; i++) {
      const message = this.generateMessage("Homer", "d'oh " + (maxMessages - i));
      const timeDiff = this.random(30000, 60000);
      time = new Date(time - timeDiff);
      message.time = time.toISOString();
      this.messages.unshift(message);
    }

    this.generateDelayedMessages();
  }

  private generateDelayedMessages() {
    setTimeout(() => {
      this.addMessage();
      this.generateDelayedMessages();
    }, this.random(15000, 30000));
  }

  private addMessage() {
    const message = this.generateMessage("Lisa", "d'oh " + (++this.count));
    this.messages.push(message);
    this.messages.shift();
    this.io.emit("message", JSON.stringify([message]));
  }

  // The maximum is exclusive and the minimum is inclusive
  private random(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private generateMessage(user: string, text: string) {
    const message = {
      type: "new-message",
      id: Number(String(Math.floor(Math.random() * (10000 - 1 + 1) + 1)) + Date.now()).toString(36),
      avatar: user.toLowerCase(),
      name: user,
      time: new Date().toISOString(),
      text: text
    };
    return message;
  }

  public getApp(): express.Application {
    return this.app;
  }
}
