import { AppServer } from "./app";
import { ChatServer } from "./chat";

const app = new AppServer().getApp();
const chat = new ChatServer().getApp();

export { app, chat };
