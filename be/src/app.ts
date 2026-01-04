import { createServer } from "http";
import { Server } from "socket.io";
import translate from "./services/translate";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("a user connected");
    try {
        socket.on("translate", async (data: any) => {
            const res = await translate(data);
            console.log("Translation result:", res);
            socket.emit("translationResult", res);
        });

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    } catch (error) {
        console.error("Error handling socket connection:", error);
    }
});


export default httpServer;