export function drawTestCircle(ctx: CanvasRenderingContext2D) {
  // 描画をクリア
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // 円を描画
  ctx.beginPath();
  ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, 80, 0, Math.PI * 2);
  ctx.fillStyle = '#6366f1'; // インディゴカラー
  ctx.fill();
  
  // ボーダー
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  // 文字
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Hello from esm.sh!', ctx.canvas.width / 2, ctx.canvas.height / 2 + 6);
  
  console.log('🎉 正常にesm.sh経由の関数 drawTestCircle が実行されました！');
}