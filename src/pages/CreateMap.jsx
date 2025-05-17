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
    formData.append("areaName", selectedAreaName);

    if (mapImage) {
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

  const handleSaveMapImage = () => {
    setMapImage(originalFrame);
  };

  // --- DESIGN STYLES ---
  const styles = {
    container: {
      fontFamily: "Segoe UI, Arial, sans-serif",
      background: "#f7f9fb",
      minHeight: "100vh",
      padding: "32px",
    },
    card: {
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      padding: "32px",
      maxWidth: "1200px",
      margin: "0 auto 32px auto",
    },
    header: {
      fontSize: "2.2rem",
      fontWeight: 700,
      marginBottom: "12px",
      color: "#2d3748",
      letterSpacing: "0.5px",
    },
    select: {
      padding: "8px 16px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      marginRight: "16px",
      fontSize: "1rem",
      background: "#f1f5f9",
    },
    input: {
      padding: "8px 16px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      background: "#f1f5f9",
      fontSize: "1rem",
      marginRight: "16px",
    },
    button: {
      padding: "10px 24px",
      borderRadius: "8px",
      border: "none",
      background: "#2563eb",
      color: "#fff",
      fontWeight: 600,
      fontSize: "1rem",
      margin: "8px 8px 0 0",
      cursor: "pointer",
      transition: "background 0.2s",
    },
    buttonSecondary: {
      background: "#64748b",
    },
    sectionTitle: {
      fontSize: "1.3rem",
      fontWeight: 600,
      margin: "24px 0 12px 0",
      color: "#334155",
    },
    liveFrame: {
      width: "100%",
      maxWidth: "900px",
      borderRadius: "12px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      margin: "0 auto",
      display: "block",
    },
    freeSlots: {
      fontSize: "1.1rem",
      color: "#059669",
      fontWeight: 600,
      margin: "8px 0",
    },
    annotatorWrapper: {
      margin: "32px 0",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      background: "#f8fafc",
      padding: "24px",
    },
    controls: {
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "12px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>Parking Map Creator</div>
        <div style={styles.controls}>
          <select
            style={styles.select}
            onChange={(e) => setSelectedAreaName(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Select Area
            </option>
            <option value="Main Entrance">Main Entrance</option>
            <option value="Side Parking">Side Parking</option>
          </select>
          <input
            style={styles.input}
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
          />
          <button
            style={styles.button}
            onClick={handleSaveMapImage}
            disabled={!originalFrame}
          >
            Set Map Image
          </button>
          <button
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={handleSaveMap}
            disabled={!positions.length || !selectedAreaName}
          >
            Save Map
          </button>
        </div>
        <div style={styles.annotatorWrapper}>
          <ParkingAnnotator
            imageSource={mapImage}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            onSave={handleSave}
            positions={positions}
          />
        </div>
        <div>
          <div style={styles.sectionTitle}>Live Parking Availability</div>
          <div style={styles.freeSlots}>
            Free Slots: {freeSlots.length}
          </div>
          {frame && (
            <>
              <div style={styles.sectionTitle}>Live Footage</div>
              <img
                src={frame}
                alt="Parking Frame"
                style={styles.liveFrame}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateMap;
