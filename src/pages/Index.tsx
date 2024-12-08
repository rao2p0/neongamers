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
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=300&h=200",
    },
    {
      title: "Snake",
      description: "Classic snake game - eat food to grow longer",
      path: "/snake",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=300&h=200",
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