interface PlaneProps {
  y: number;
  rotation: number;
}

const Plane = ({ y, rotation }: PlaneProps) => {
  return (
    <>
      <div
        className="absolute w-[30px] h-[30px] transition-transform"
        style={{
          left: "100px",
          top: `${y}px`,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <div className="w-full h-full bg-white clip-path-triangle" />
      </div>
      
      <div
        className="absolute w-[100px] h-[2px] opacity-50"
        style={{
          left: "30px",
          top: `${y + 15}px`,
          background: "linear-gradient(to left, red, orange, yellow, green, blue, indigo, violet)",
        }}
      />
    </>
  );
};

export default Plane;