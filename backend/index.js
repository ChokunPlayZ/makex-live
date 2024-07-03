const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var stages = [
    {
        name: "Automatic Stage",
        time: 30,
    },
    {
        name: "Manual Stage",
        time: 100,
    },
    {
        name: "Modification Stage",
        time: 60,
    },
    {
        name: "Final Stage",
        time: 90,
    },
];

let currentstage = 0;
let overlayconnected = false;

// WebSocket server logic
wss.on("connection", (ws) => {
    async function broadcast(message) {
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }

    let clienttype
    ws.on("message", (message) => {
        mg = JSON.parse(message);
        if (mg.ACTION == "ping") {
            clienttype = mg.clientType
            if (clienttype) {
                if (mg.clientType == "overlay") {
                    overlayconnected = true;
                    broadcast({
                        message: "overlay is online",
                        type: "OVERLAY_UPDATE",
                        status: "ONLINE",
                    });
                }
                ws.send(
                    JSON.stringify({
                        STATUS: "OK",
                        CurrentStage: stages[currentstage],
                        isOverlayOnline: overlayconnected,
                    })
                );
            } else {
                ws.send(JSON.stringify({
                    STATUS:"Pong!"
                }))
            }
            // console.log(mg.clientType)
            
        } else {
            if (mg.ACTION === "Set Stage") {
                currentstage = mg.STAGE
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({type: "STAGE_UPDATE",CurrentStage: stages[mg.STAGE]}));
                    }
                });
            } else {
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(mg));
                    }
                });
            }
        }
    });

    ws.on("close", () => {
        if (clienttype == "overlay") {
            broadcast({
                message: "overlay is offline",
                type: "OVERLAY_UPDATE",
                status: "OFFLINE",
            });
        }
    });
});

server.listen(3001, () => {
    console.log("WebSocket server listening on port 3001");
});
