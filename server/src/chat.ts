import { createServer, Server } from "http";
import * as express from "express";
import * as socketIo from "socket.io";

export class ChatServer {
  public static readonly PORT: number = 4301;
  private app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;

  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
  }

  private createApp(): void {
    this.app = express();
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  private config(): void {
    this.port = process.env.PORT || ChatServer.PORT;
  }

  private sockets(): void {
    this.io = socketIo(this.server);
  }

  private listen(): void {
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
