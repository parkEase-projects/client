import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function ParkingLive() {
  const [freeSlots, setFreeSlots] = useState([]);
  const [frame, setFrame] = useState(null);

  useEffect(() => {
    const handleUpdate = (data) => {
      console.log("Received:", data.free_slots);
      setFreeSlots(data.free_slots);
      setFrame(`data:image/jpeg;base64,${data.frame}`);
    };

    socket.on("update_slots", handleUpdate);

    return () => {
      socket.off("update_slots", handleUpdate);
    };
  }, []);

  return (
    <div>
      <h2>Live Parking Availability</h2>
      <p>Free Slots: {freeSlots.length}</p>
      {/* <ul>
        {freeSlots.map((slot) => (
          <li key={slot}>Slot #{slot}</li>
        ))}
      </ul> */}
      {frame && (
        <>
          <h3>Live Footage</h3>
          <div className=" d-flex justify-content-center">
            <img src={frame} alt="Parking Frame" style={{ width: "1000px" }} />
          </div>
        </>
      )}
    </div>
  );
}

export default ParkingLive;
