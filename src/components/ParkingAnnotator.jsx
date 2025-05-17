import React, { useEffect, useRef } from "react";

function ParkingAnnotator({ imageSource, onMouseUp, onMouseDown, positions, onSave }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx && imageSource) {
            const img = new Image();
            img.src = imageSource;
            img.onload = () => {
                canvasRef.current.width = img.width;
                canvasRef.current.height = img.height;
                ctx.drawImage(img, 0, 0);
                // redraw boxes with index
                positions.forEach(({ x, y, width, height }, index) => {
                    ctx.strokeStyle = "red";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x, y, width, height);
                    ctx.fillStyle = "yellow";
                    ctx.font = "16px Arial";
                    ctx.fillText(index, x + 4, y + 18);
                });
            };
        }
    }, [imageSource, positions]);

    return (
        <div>
            <canvas
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                style={{ cursor: "crosshair", border: "1px solid black" }}
            ></canvas>
            <button onClick={onSave}>Save Rectangles</button>
            {/* <ul>
                {positions.map(({ x, y, width, height }, index) => (
                    <li key={index}>
                        Box {index}: x={x}, y={y}, width={width}, height={height}
                    </li>
                ))}
            </ul> */}
        </div>
    );
}

export default ParkingAnnotator;
