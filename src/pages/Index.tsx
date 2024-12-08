import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const games = [
    {
      title: "Tetris",
      description: "Classic block-stacking puzzle game",
      path: "/tetris",
      image: "/lovable-uploads/970e8a81-557c-4f50-a698-f552796794c7.png",
    },
    {
      title: "Snake",
      description: "Classic snake game - eat food to grow longer",
      path: "/snake",
      image: "/lovable-uploads/37d7986f-390e-46cf-a105-1466ac930198.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Arcade Games</h1>
        <p className="text-center text-gray-400 mb-12">Choose a game to play</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card key={game.title} className="bg-gray-800 border-gray-700">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{game.title}</h2>
                <p className="text-gray-400 mb-4">{game.description}</p>
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