import { useEffect, useState } from "react";
import { useOnDraw } from "./Hooks";

const Canvas = () => {
  const [CWidth, setCWidth] = useState(0);
  const [Cheight, setCHeight] = useState(0);
  const { setCanvasRef, onCanvasMouseDown } = useOnDraw(onDraw);

  function onDraw(ctx, point, prevPoint) {
    drawLine(prevPoint, point, ctx, "#000000", 5);
  }

  function drawLine(start, end, ctx, color, width) {
    start = start ?? end;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  useEffect(() => {
    const handleResize = () => {
      const newCHeight = window.innerHeight / 2;
      let newCWidth;
      if (window.innerWidth < 720) {
        newCWidth = window.innerWidth;
      } else {
        newCWidth = (2 * window.innerWidth) / 3;
      }
      // Update the state with the new values
      setCHeight(newCHeight);
      setCWidth(newCWidth);
    };

    // Add an event listener to track window resize
    window.addEventListener("resize", handleResize);

    // Call handleResize initially to set the initial values
    handleResize();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <h1 className="absolute">Draw Here</h1>
      <canvas
        width={CWidth}
        height={Cheight}
        onMouseDown={onCanvasMouseDown}
        style={canvasStyle}
        ref={setCanvasRef}
      />
    </>
  );
};

export default Canvas;

const canvasStyle = {
  border: "0px solid black",
};
