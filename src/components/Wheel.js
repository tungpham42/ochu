import React, { useEffect, useState, useRef } from "react";

const Wheel = ({
  segments,
  segColors,
  winningSegment,
  onFinished,
  primaryColor = "black",
  contrastColor = "white",
  buttonText = "Spin",
  isOnlyOnce = true,
  size = window.innerWidth,
  upDuration = 100,
  downDuration = 1000,
  fontFamily = "proxima-nova",
  fontSize = "1em",
  outlineWidth = 10,
}) => {
  const randomString = () => {
    const chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split("");
    return Array.from(
      { length: 8 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  const canvasId = useRef(`canvas-${randomString()}`);
  const wheelId = useRef(`wheel-${randomString()}`);
  const dimension = (size + 20) * 2;
  let currentSegment = "";
  let isStarted = false;
  const [isFinished, setFinished] = useState(false);
  let timerHandle = 0;
  const timerDelay = segments.length;
  let angleCurrent = 0;
  let angleDelta = 0;
  let canvasContext = null;
  let maxSpeed = Math.PI / segments.length;
  const upTime = segments.length * upDuration;
  const downTime = segments.length * downDuration;
  let spinStart = 0;
  let frames = 0;
  const centerX = size + 20;
  const centerY = size + 20;

  useEffect(() => {
    wheelInit();
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 0);
  }, []);

  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  };

  const initCanvas = () => {
    let canvas = document.getElementById(canvasId.current);

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.width = dimension;
      canvas.height = dimension;
      canvas.id = canvasId.current;
      document.getElementById(wheelId.current)?.appendChild(canvas);
    }
    canvas.addEventListener("click", spin, false);
    canvasContext = canvas.getContext("2d");
  };

  const spin = () => {
    isStarted = true;
    if (timerHandle === 0) {
      spinStart = new Date().getTime();
      maxSpeed = Math.PI / segments.length;
      frames = 0;
      timerHandle = setInterval(onTimerTick, timerDelay);
    }
  };

  const onTimerTick = () => {
    frames++;
    draw();
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;

    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      progress = duration / downTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      if (progress >= 1) finished = true;
    }

    angleCurrent += angleDelta;
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
    if (finished) {
      setFinished(true);
      onFinished(currentSegment);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
    }
  };

  const wheelDraw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const draw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const drawSegment = (key, lastAngle, angle) => {
    if (!canvasContext) return;
    const ctx = canvasContext;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = segColors[key % segColors.length];
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  const drawWheel = () => {
    if (!canvasContext) return;
    const ctx = canvasContext;
    let lastAngle = angleCurrent;
    const PI2 = Math.PI * 2;
    ctx.lineWidth = 1;
    ctx.strokeStyle = primaryColor;

    for (let i = 0; i < segments.length; i++) {
      const angle = PI2 * ((i + 1) / segments.length) + angleCurrent;
      drawSegment(i, lastAngle, angle);
      lastAngle = angle;
    }
  };

  const drawNeedle = () => {
    if (!canvasContext) return;
    const ctx = canvasContext;
    ctx.beginPath();
    ctx.moveTo(centerX + 20, centerY - 50);
    ctx.lineTo(centerX - 20, centerY - 50);
    ctx.lineTo(centerX, centerY - 70);
    ctx.closePath();
    ctx.fill();
    let i =
      segments.length -
      Math.floor(
        ((angleCurrent + Math.PI / 2) / (Math.PI * 2)) * segments.length
      ) -
      1;
    if (i < 0) i += segments.length;
    currentSegment = segments[i];
    if (isStarted) ctx.fillText(currentSegment, centerX, centerY + size + 50);
  };

  const clear = () => {
    if (!canvasContext) return;
    canvasContext.clearRect(0, 0, dimension, dimension);
  };

  return (
    <div id={wheelId.current}>
      <canvas
        id={canvasId.current}
        width={dimension}
        height={dimension}
        style={{ pointerEvents: isFinished && isOnlyOnce ? "none" : "auto" }}
      />
    </div>
  );
};

export default Wheel;
