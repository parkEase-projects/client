import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // adjust for your Flask host/port

function ParkingLive() {
  const [freeSlots, setFreeSlots] = useState([]);

  useEffect(() => {
    const handleUpdate = (data) => {
      console.log("Received:", data.free_slots);
      setFreeSlots(data.free_slots);
    };

    socket.on("update_slots", handleUpdate);

    return () => {
      socket.off("update_slots", handleUpdate); // Clean up listener
    };
  }, []);

  return (
    <div>
      <h2>Live Parking Availability</h2>
      <p>Free Slots: {freeSlots.length}</p>
      <ul>
        {freeSlots.map((slot) => (
          <li key={slot}>Slot #{slot}</li>
        ))}
      </ul>
    </div>
  );
}

export default ParkingLive;
