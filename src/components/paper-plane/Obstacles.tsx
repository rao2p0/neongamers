interface Obstacle {
  x: number;
  height: number;
}

interface ObstaclesProps {
  obstacles: Obstacle[];
}

const Obstacles = ({ obstacles }: ObstaclesProps) => {
  return (
    <>
      {obstacles.map((obstacle, index) => (
        <div key={index}>
          <div
            className="absolute bg-gradient-to-b from-red-500 to-orange-500"
            style={{
              left: `${obstacle.x}px`,
              top: 0,
              width: 60,
              height: obstacle.height,
            }}
          />
          <div
            className="absolute bg-gradient-to-b from-red-500 to-orange-500"
            style={{
              left: `${obstacle.x}px`,
              top: obstacle.height + 200,
              width: 60,
              height: 500 - (obstacle.height + 200),
            }}
          />
        </div>
      ))}
    </>
  );
};

export default Obstacles;