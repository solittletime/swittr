import { createServer, Server } from 'http';
import * as express from 'express';
import * as path from 'path';

export class Swittr {
  public static readonly PORT: number = 4300;
  public static readonly BASE: string = '/../../client/dist';
  private app: express.Application;
  private server: Server;
  private port: string | number;

  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.routes();
    this.listen();
  }

  private createApp(): void {
    this.app = express();
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  private config(): void {
    this.port = process.env.PORT || Swittr.PORT;
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });
  }

  private routes(): void {
    let router = express.Router();
    router.get('/', (req, res, next) => {
      res.sendFile(path.join(__dirname + Swittr.BASE + '/index.html'));
    });
    this.app.use('/', express.static(path.join(__dirname, Swittr.BASE)))

  }

  public getApp(): express.Application {
    return this.app;
  }
}
