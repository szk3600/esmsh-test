// アニメーション用の関数 (自動検知 'draw' で実行されます)
export function draw(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // パーティクル配列を生成して描画
  const center = { x: ctx.canvas.width / 2, y: ctx.canvas.height / 2 };
  const time = Date.now() * 0.002;
  
  for (let i = 0; i < 40; i++) {
    const angle = (i / 40) * Math.PI * 2 + time;
    const radius = 90 + Math.sin(time * 2 + i) * 30;
    const px = center.x + Math.cos(angle) * radius;
    const py = center.y + Math.sin(angle) * radius;
    
    ctx.beginPath();
    ctx.arc(px, py, 6 + Math.cos(time + i) * 3, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${(i * 9 + time * 50) % 360}, 80%, 65%)`;
    ctx.fill();
  }

  // 中心テキスト
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Dynamic Animation Loop Run successfully!', center.x, center.y);
}