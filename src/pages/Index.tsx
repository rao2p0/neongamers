import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const games = [
    {
      title: "Tetris",
      path: "/tetris",
      image: "/lovable-uploads/970e8a81-557c-4f50-a698-f552796794c7.png",
    },
    {
      title: "Snake",
      path: "/snake",
      image: "/lovable-uploads/37d7986f-390e-46cf-a105-1466ac930198.png",
    },
    {
      title: "Flappy Bird",
      path: "/flappy-bird",
      image: "/lovable-uploads/56a4bcea-80aa-4d31-b881-64891710670f.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Arcade Games</h1>
        <p className="text-center text-gray-400 mb-12">Choose a game to play</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <Card key={game.title} className="bg-gray-800 border-gray-700 overflow-hidden">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-4 text-white">{game.title}</h2>
                <Button 
                  onClick={() => navigate(game.path)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Play Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;