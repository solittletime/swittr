import { createServer, Server } from "http";
import * as express from "express";
import * as path from "path";
import * as socketIo from "socket.io";

export class AppServer {
  public static readonly PORT: number = 4300;
  public static readonly BASE: string = "/../../client/dist";
  private app: express.Application;
  private io: SocketIO.Server;
  private port: string | number;
  private server: Server;

  constructor() {
    this.createApp();
    this.config();
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

  private config(): void {
    this.port = process.env.PORT || AppServer.PORT;
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });
  }

  private routes(): void {
    const router = express.Router();
    router.get("/", (req, res, next) => {
      res.sendFile(path.join(__dirname + AppServer.BASE + "/index.html"));
    });
    this.app.use("/", express.static(path.join(__dirname, AppServer.BASE)));

  }

  private sockets(): void {
    this.io = socketIo(this.server);

    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });

    this.io.on("connect", (socket: any) => {
      console.log("User connected on port %s.", this.port);
      socket.on("add-message", (message: string) => {
        console.log("server: %s", JSON.stringify(message));
        this.io.emit("message",
          {
            type: "new-message",
            id: Number(String(Math.floor(Math.random() * (10000 - 1 + 1) + 1)) + Date.now()).toString(36),
            avatar: "homer",
            name: "Homer Simpson",
            time: new Date().toISOString(),
            text: message
          }
        );
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
