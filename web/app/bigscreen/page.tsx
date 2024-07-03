"use client";
import { useEffect, useState } from "react";

export default function Timer() {
  const [currentStage, setCurrentStage] = useState({ name: "", time: 0 }); // Initialize with empty values
  const [timer, setTimer] = useState("00:00");

  let timerFunc; // Declare timerFunc here to maintain its reference
  let time;

  function updateTimer(secondsLeft: number) {
    const minutes = Math.round(Math.max(Math.floor(secondsLeft / 60), 0));
    const seconds = Math.round(Math.max(secondsLeft % 60, 0)); // Ensure seconds are at least 0
    const formattedMinutes = String(minutes).padStart(2, "0"); // Ensures two digits with leading zero
    const formattedSeconds = String(seconds).padStart(2, "0"); // Ensures two digits with leading zero
    const timeString = `${formattedMinutes}:${formattedSeconds}`;

    setTimer(timeString);
  }

  useEffect(() => {
    const ws = new WebSocket("wss://mx2.chokunplayz.com/ws");

    ws.addEventListener("open", async () => {
      ws.send(JSON.stringify({ ACTION: "ping", clientType: "overlay" }));
    });

    ws.addEventListener("message", async (event) => {
      const data = JSON.parse(event.data); // Parse JSON data

      if (data.STATUS === "OK") {
        setCurrentStage(data.CurrentStage);
        time = data.CurrentStage.time;
        updateTimer(data.CurrentStage.time);
      }

      if (data.type === "STAGE_UPDATE") {
        setCurrentStage(data.CurrentStage);
        time = data.CurrentStage.time;
        updateTimer(data.CurrentStage.time);
      }

      if (data.ACTION === "START") {
        console.log("start");
        clearInterval(timerFunc);
        var ftimeLeft = time;
        timerFunc = setInterval(function () {
          ftimeLeft = ftimeLeft - 0.1;
          updateTimer(ftimeLeft);
          if (ftimeLeft <= 0) {
            console.log("Timer ended");
            clearInterval(timerFunc);
          }
        }, 100);
      }

      if (data.ACTION === "STOP") {
        console.log("triggered stop");
        clearInterval(timerFunc);
      }
    });

    // Handle WebSocket errors and close events
    ws.addEventListener("error", (event) => {
      console.error("WebSocket error:", event);
      // Handle reconnection or other error handling logic here
    });

    ws.addEventListener("close", (event) => {
      console.log("WebSocket closed with code:", event.code);
      // Handle reconnection or other close handling logic here
    });

    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ ACTION: "ping"}));
      }
    }, 5000);

    // Cleanup on unmount
    return () => {
      clearInterval(timerFunc);
      clearInterval(pingInterval);
      ws.close();
    };
  }, []);

  return (
    <main className="h-screen w-screen bg-black flex flex-col justify-between">
      <div className=" m-[20%]">
        <h1 className=" text-6xl">
          <span >{currentStage.name}</span>
        </h1>
        <h2 className="text-7xl mt-4">
        <span>{timer}</span>
        </h2>
      </div>
    </main>
  );
  
  
  
}
