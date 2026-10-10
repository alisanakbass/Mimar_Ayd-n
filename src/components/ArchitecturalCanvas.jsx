import React, { useEffect, useRef } from 'react';

/**
 * ArchitecturalCanvas
 * Sade, şık mimari CAD ızgarası ve lazer tarama çizgisi (Yazısız & Temiz Arka Plan)
 */
export default function ArchitecturalCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = 0;
    let height = 0;

    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;

    let scanY = 0;
    let time = 0;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      targetMouseX = -1000;
      targetMouseY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.parentElement?.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      time += 0.02;

      // Mouse takibi
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. MİMARİ BLUEPRINT IZGARASI (GRID)
      const gridSize = 54;
      ctx.lineWidth = 1;

      // Dikey çizgiler
      for (let x = 0; x < width; x += gridSize) {
        const distToMouse = Math.abs(x - mouseX);
        const glow = Math.max(0, 1 - distToMouse / 220);
        ctx.strokeStyle = glow > 0.05 
          ? `rgba(197, 168, 128, ${0.04 + glow * 0.22})` 
          : 'rgba(255, 255, 255, 0.025)';

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Yatay çizgiler
      for (let y = 0; y < height; y += gridSize) {
        const distToMouse = Math.abs(y - mouseY);
        const glow = Math.max(0, 1 - distToMouse / 220);
        ctx.strokeStyle = glow > 0.05 
          ? `rgba(197, 168, 128, ${0.04 + glow * 0.22})` 
          : 'rgba(255, 255, 255, 0.025)';

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Kesişim Artıları (+)
      const crossSize = 3;
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.16)';
      for (let x = 0; x < width; x += gridSize * 2) {
        for (let y = 0; y < height; y += gridSize * 2) {
          ctx.beginPath();
          ctx.moveTo(x - crossSize, y);
          ctx.lineTo(x + crossSize, y);
          ctx.moveTo(x, y - crossSize);
          ctx.lineTo(x, y + crossSize);
          ctx.stroke();
        }
      }

      // 2. FÜTÜRİSTİK CAD LAZER TARAMA ÇİZGİSİ (Yazısız, Temiz Hüzme)
      scanY = (scanY + 1.1) % (height + 150);
      const curScanY = scanY - 75;

      if (curScanY > -50 && curScanY < height + 50) {
        const scanGrad = ctx.createLinearGradient(0, curScanY - 80, 0, curScanY);
        scanGrad.addColorStop(0, 'rgba(197, 168, 128, 0)');
        scanGrad.addColorStop(0.7, 'rgba(197, 168, 128, 0.03)');
        scanGrad.addColorStop(1, 'rgba(197, 168, 128, 0.16)');
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, curScanY - 80, width, 80);

        ctx.strokeStyle = 'rgba(223, 202, 171, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, curScanY);
        ctx.lineTo(width, curScanY);
        ctx.stroke();
      }

      // 3. İNTERAKTİF MİMARİ MOUSE PERGELİ (Yazısız Sade Efekt)
      if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
        ctx.save();
        ctx.translate(mouseX, mouseY);
        ctx.rotate(time * 0.35);

        ctx.strokeStyle = 'rgba(197, 168, 128, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, 48, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = 'rgba(197, 168, 128, 0.5)';
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.moveTo(0, -10);
        ctx.lineTo(0, 10);
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.parentElement?.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="architectural-blueprint-canvas"
      aria-hidden="true"
    />
  );
}
