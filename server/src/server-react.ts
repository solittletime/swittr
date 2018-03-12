import { AppServer } from "./app";

const app = new AppServer("/../../client-react/build", 4500).getApp();

export { app };
