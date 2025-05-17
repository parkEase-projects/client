import React, { useState, useEffect } from "react";

import ParkingAnnotator from "../components/ParkingAnnotator";
import ParkingLive from "../components/ParkingLive";

import io from "socket.io-client";

const socket = io("http://localhost:5000");

function CreateMap(props) {
  const [positions, setPositions] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [index, setIndex] = useState(1);
  const [freeSlots, setFreeSlots] = useState([]);
  const [frame, setFrame] = useState(null);
  const [originalFrame, setOriginalFrame] = useState(null);
  const [mapImage, setMapImage] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [selectedAreaName, setSelectedAreaName] = useState(null);

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);
    setVideoFile(file);

    const response = await fetch(
      "http://localhost:5000/api/parking/upload-video",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      alert("Video uploaded and processing started.");
    } else {
      alert("Failed to upload video.");
    }
  };

  useEffect(() => {
    const handleUpdate = (data) => {
      console.log("Received:", data.free_slots);
      setFreeSlots(data.free_slots);
      setFrame(`data:image/jpeg;base64,${data.frame}`);
      setOriginalFrame(`data:image/jpeg;base64,${data.frame_original}`);
    };

    socket.on("update_slots", handleUpdate);

    return () => {
      socket.off("update_slots", handleUpdate);
    };
  }, []);

  const handleMouseDown = (e) => {
    const rect = e.target.getBoundingClientRect();
    setStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDrawing(true);
  };
  const handleMouseUp = (e) => {
    if (!drawing) return;
    const rect = e.target.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const width = endX - start.x;
    const height = endY - start.y;

    const newRect = {
      x: start.x,
      y: start.y,
      width,
      height,
      index,
    };

    setPositions([...positions, newRect]);
    setIndex(index + 1);
    setDrawing(false);
  };
  const handleSave = () => {
    const finalList = positions.map(({ x, y, index, width, height }) => [
      Math.round(x),
      Math.round(y),
      index,
      Math.round(width),
      Math.round(height),
    ]);
    console.log(finalList);

    // send to backend
    fetch("http://localhost:5000/api/parking/save-positions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ positions: finalList }),
    }).then((res) => {
      if (res.ok) alert("Saved successfully");
      else alert("Error saving");
    });
  };
  const handleSaveMap2 = () => {
    const finalList = positions.map(({ x, y, index, width, height }) => [
      Math.round(x),
      Math.round(y),
      index,
      Math.round(width),
      Math.round(height),
    ]);

    const formData = new FormData();
    formData.append("positions", JSON.stringify(finalList));

    if (mapImage) {
      // assuming mapImage is a File or Blob
      formData.append("mapImage", mapImage);
    }

    if (videoFile) {
      formData.append("videoFile", videoFile);
    }

    fetch("http://localhost:5000/api/parking/save-map", {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.ok) alert("Saved successfully");
      else alert("Error saving");
    });
  };
  const handleSaveMap = () => {
    const finalList = positions.map(({ x, y, index, width, height }) => [
      Math.round(x),
      Math.round(y),
      index,
      Math.round(width),
      Math.round(height),
    ]);

    const formData = new FormData();
    formData.append("positions", JSON.stringify(finalList));
    formData.append("areaName", selectedAreaName); // Add this

    if (mapImage) {
      console.log("MAP IMAGE: ", mapImage);
      formData.append("mapImage", mapImage); // should be a File object
    }

    if (videoFile) {
      formData.append("videoFile", videoFile); // should be a File object
    }

    fetch("http://localhost:5000/api/parking/save-map", {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.ok) alert("Saved successfully");
      else alert("Error saving");
    });
  };

  const handleSaveMapImage = () => {
    setMapImage(originalFrame);
  };
  return (
    <div>
      <select onChange={(e) => setSelectedAreaName(e.target.value)}>
        <option value="Main Entrance">Main Entrance</option>
        <option value="Side Parking">Side Parking</option>
      </select>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />

      <ParkingAnnotator
        imageSource={mapImage}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onSave={handleSave}
        positions={positions}
      />
      {/* <ParkingLive /> */}
      <button onClick={handleSaveMapImage} style={{ marginTop: "10px" }}>
        Set Map Image
      </button>
      <button onClick={handleSaveMap} style={{ marginTop: "10px" }}>
        Save Map
      </button>
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
              <img
                src={frame}
                alt="Parking Frame"
                style={{ width: "1000px" }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CreateMap;
