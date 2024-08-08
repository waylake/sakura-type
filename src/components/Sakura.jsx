import React, { useEffect, useRef } from "react";

const Sakura = ({ windSpeed }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const petals = [];
    const petalCount = 50;

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 10 + 5,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 1 + 1,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1,
        opacity: Math.random() * 0.5 + 0.5,
      });
    }

    const drawPetal = (petal) => {
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate((petal.rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        petal.size / 2,
        -petal.size / 2,
        petal.size,
        -petal.size / 2,
        petal.size,
        0,
      );
      ctx.bezierCurveTo(
        petal.size,
        petal.size / 2,
        petal.size / 2,
        petal.size / 2,
        0,
        0,
      );
      ctx.fillStyle = `rgba(255, 183, 197, ${petal.opacity})`;
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petals.forEach((petal) => {
        petal.x += petal.speedX * windSpeed;
        petal.y += petal.speedY;
        petal.rotation += petal.rotationSpeed;

        if (petal.y > canvas.height) {
          petal.y = -petal.size;
          petal.x = Math.random() * canvas.width;
        }

        if (petal.x > canvas.width) {
          petal.x = -petal.size;
        } else if (petal.x < -petal.size) {
          petal.x = canvas.width;
        }

        drawPetal(petal);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [windSpeed]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />
  );
};

export default React.memo(Sakura);
