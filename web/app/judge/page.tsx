'use client';

import { useEffect, useState } from 'react'

type currentstage = {
  name: string;
}

export default function Judge() {
  const [serverstatus, setServerStatus] = useState('OFFLINE');
  const [serverstatuscolor, setServerStatusColor] = useState('text-red-600');
  const [overlaystatus, setoverlayStatus] = useState('Disconnected');
  const [overlaystatuscolor, setoverlayStatusColor] = useState('text-red-600');
  const [currentstage, setCurrentStage] = useState<currentstage> ({name:"wait"});
  const [currenttime, setCurrentTime] = useState('0 minutes 0 seconds')
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const checkServerStatus = async () => {
    try {
      const response = await fetch('/api/ping');
      const data = await response.json();

      if (data.code === 200) {
        setServerStatus('ONLINE');
        setServerStatusColor('text-green-600');
      } else {
        setServerStatus('OFFLINE');
        setServerStatusColor('text-red-600');
      }
    } catch (error) {
      setServerStatus('OFFLINE');
      setServerStatusColor('text-red-600');
    }
  };

  useEffect(() => {
    const ws = new WebSocket("wss://mx2.chokunplayz.com/ws"); // WebSocket server address
    setSocket(ws);

    ws.addEventListener('open', (event) => {
      ws.send(JSON.stringify({ACTION:"ping", clientType:"judge"}))
    })

    // Handle messages received from the server
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      // You can update your UI or perform other actions based on the received message

      if (message.STATUS === "OK") {
        setCurrentStage(message.CurrentStage);
      }

      if (message.type === "STAGE_UPDATE") {
        setCurrentStage(message.CurrentStage);
      }

      if (message.type == "OVERLAY_UPDATE") {
        if (message.status == "ONLINE") {
          setoverlayStatus("connected");
          setoverlayStatusColor("text-green-600");
        } else {
          setoverlayStatus("disconnected");
          setoverlayStatusColor("text-red-600");
        }
      }
      if (message.STATUS === "OK") {
        if (message.isOverlayOnline) {
          setoverlayStatus("connected");
          setoverlayStatusColor("text-green-600");
        } else {
          setoverlayStatus("disconnected");
          setoverlayStatusColor("text-red-600");
        }
      }
    });

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 10000);

    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ ACTION: "ping"}));
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(pingInterval);
      ws.close();
    };
  }, []);

  const setStage = async (stageid:number) => {
    socket.send(JSON.stringify({ACTION:"Set Stage", STAGE:stageid}))
  }

  const setTimer = async (action:string) => {
    socket.send(JSON.stringify({ACTION:action}))
  }

  return (
    <main>
      <div className=' flex flex-col space-y-2 text-center align-middle mt-10 text-lg'>
        <h1 className=' text-xl'>Judge Control Panel</h1>
        <div>
          <h2>Timer</h2>
          Stage: <span>{currentstage.name}</span><br />
          {/* Time: <span>{currenttime}</span><br /> */}
        </div>
        <div className=' mt-10'>
          <h2 className=' text-xl'>Timer Control</h2>
          <button onClick={() => setTimer("START")} className=' w-[150px] rounded-full  bg-green-500 px-4 mt-4'>Start Timer</button><br />
          <button onClick={() => setTimer("STOP")} className=' w-[150px] rounded-full  bg-red-500 px-4 mt-4'>Stop Timer</button><br />
          <button onClick={() => setTimer("SKIP")} className=' w-[150px] rounded-full  bg-orange-500 px-4 mt-4'>Skip Stage</button><br />
        </div>
        <br />
        <div className=' mt-10'>
          <h2>Stage Control</h2>
          <button onClick={() => setStage(0)} className=' w-[150px] rounded-full  bg-pink-500 px-4 mt-4'>Automatic</button><br />
          <button onClick={() => setStage(1)} className=' w-[150px] rounded-full  bg-pink-500 px-4 mt-4'>Manual</button><br />
          <button onClick={() => setStage(2)} className=' w-[150px] rounded-full  bg-pink-500 px-4 mt-4'>Modification</button><br />
          <button onClick={() => setStage(3)} className=' w-[150px] rounded-full  bg-pink-500 px-4 mt-4'>Final</button><br />
        </div>
        <br />
        <div>
          <h2>Status</h2>
          Server: <span className={serverstatuscolor}>{serverstatus}</span><br />
          Overlay: <span className={overlaystatuscolor}>{overlaystatus}</span>
        </div>
      </div>
    </main>
  )
}
