export interface PaddleState {
  x: number;
  y: number;
}

export const drawPaddle = (ctx: CanvasRenderingContext2D, paddle: PaddleState, width: number, height: number) => {
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(paddle.x, paddle.y, width, height);
};

export const updatePaddlePosition = (currentX: number, movement: number, canvasWidth: number, paddleWidth: number): number => {
  const newX = currentX + movement;
  return Math.max(0, Math.min(canvasWidth - paddleWidth, newX));
};