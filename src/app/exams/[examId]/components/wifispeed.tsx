"use client";

import { useEffect, useState } from "react";
import { Wifi } from "lucide-react";

export default function NetworkSpeed() {
  const [speed, setSpeed] = useState<number | null>(null);

  useEffect(() => {
    const checkSpeed = async () => {
      const start = new Date().getTime();
      try {
        await fetch("https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png", { mode: "no-cors" });
        const end = new Date().getTime();
        const duration = (end - start) / 1000; // Time in seconds
        const speedMbps = (100 / duration).toFixed(2); // Approximate speed
        setSpeed(Number(speedMbps));
      } catch (error) {
        setSpeed(null);
      }
    };

    checkSpeed();
    const interval = setInterval(checkSpeed, 10000); // Update every 10s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 p-2 text-sm">
      <Wifi size={18} />
      <span>{speed ? `${speed} Mbps` : "Checking..."}</span>
    </div>
  );
}
