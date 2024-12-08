export interface BallState {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export const drawBall = (ctx: CanvasRenderingContext2D, ball: BallState, radius: number) => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.closePath();
};

export const updateBall = (ball: BallState, canvas: HTMLCanvasElement, paddleX: number, paddleWidth: number, paddleY: number, radius: number): BallState => {
  const newBall = { ...ball };

  // Wall collisions
  if (newBall.x + radius > canvas.width || newBall.x - radius < 0) {
    newBall.dx *= -1;
  }
  if (newBall.y - radius < 0) {
    newBall.dy *= -1;
  }

  // Paddle collision
  if (
    newBall.y + radius > paddleY &&
    newBall.x > paddleX &&
    newBall.x < paddleX + paddleWidth
  ) {
    newBall.dy = -Math.abs(newBall.dy);
  }

  // Update ball position
  newBall.x += newBall.dx;
  newBall.y += newBall.dy;

  return newBall;
};