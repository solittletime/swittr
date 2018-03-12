import { createServer, Server } from "http";
import * as express from "express";
import * as path from "path";
import * as socketIo from "socket.io";

export class AppServer {
  private app: express.Application;
  private io: SocketIO.Server;
  private base: string;
  private port: string | number;
  private server: Server;

  constructor(base = "/../../client-angular/dist", port = 4300) {
    this.base = base;
    this.port = process.env.PORT || port;
    this.createApp();
    this.createServer();
    this.routes();
    this.listen();
    this.sockets();
  }

  private createApp(): void {
    this.app = express();
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  private routes(): void {
    const router = express.Router();
    router.get("/", (req, res, next) => {
      res.sendFile(path.join(__dirname + this.base + "/index.html"));
    });
    this.app.use("/", express.static(path.join(__dirname, this.base)));
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });
  }

  private sockets(): void {
    const _appServer = this;
    const a = [
      { name: "Homer", message: "Lisa, if you don't like your job you don't strike. You just go in every day and do it really half-assed. That's the American way." },
      { name: "Lisa", message: "I had a cat named Snowball. She died! She died! Mom said she was sleeping. She lied! She lied! Why oh why is my cat dead? Couldn’t that Chrysler hit me instead?" }
    ];

    this.io = socketIo(this.server);

    this.io.on("connect", (socket: any) => {
      console.log("User connected on port %s.", this.port);
      socket.on("add-message", (message: string) => {
        console.log("server: %s", JSON.stringify(message));
        this.io.emit("message", _appServer.generateMessage("Owl", message));
      });
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });

      try {
        setTimeout(_ => {
          a.forEach((bot) => {
            this.io.emit("message", _appServer.generateMessage(bot.name, bot.message));
          });
        }, 5000);
      } catch (err) {
        console.log(err);
      }
    });
  }

  generateMessage(user: string, text: string) {
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
