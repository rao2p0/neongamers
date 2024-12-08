export interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  visible: boolean;
}

export const drawBlocks = (ctx: CanvasRenderingContext2D, blocks: Block[]) => {
  blocks.forEach(block => {
    if (block.visible) {
      ctx.fillStyle = block.color;
      ctx.fillRect(block.x, block.y, block.width, block.height);
    }
  });
};

export const initializeBlocks = (rows: number, cols: number, blockWidth: number, blockHeight: number, padding: number): Block[] => {
  const blocks: Block[] = [];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      blocks.push({
        x: col * (blockWidth + padding) + 100,
        y: row * (blockHeight + padding) + 50,
        width: blockWidth,
        height: blockHeight,
        color: colors[row],
        visible: true
      });
    }
  }
  return blocks;
};

export const checkBlockCollisions = (ball: { x: number; y: number }, blocks: Block[]): { blocks: Block[]; collision: boolean } => {
  let collision = false;
  const updatedBlocks = blocks.map((block, index) => {
    if (block.visible &&
        ball.x > block.x &&
        ball.x < block.x + block.width &&
        ball.y > block.y &&
        ball.y < block.y + block.height
    ) {
      collision = true;
      return { ...block, visible: false };
    }
    return block;
  });
  
  return { blocks: updatedBlocks, collision };
};