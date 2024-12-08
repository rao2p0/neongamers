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
    {
      title: "Minesweeper",
      path: "/minesweeper",
      image: "/lovable-uploads/d873acd0-6b85-4499-8805-3747a10cd63f.png",
    },
    {
      title: "Hangman",
      path: "/hangman",
      image: "/lovable-uploads/0968f01e-5743-46f5-a775-b4434a17e8bc.png",
    },
    {
      title: "Tic Tac Toe",
      path: "/tic-tac-toe",
      image: "/lovable-uploads/a53f49b2-5623-4b84-a67b-c35dd1d052c7.png",
    },
    {
      title: "Sudoku",
      path: "/sudoku",
      image: "/lovable-uploads/9c4c54c2-03bf-48ac-b1d5-14dbe136a47a.png",
    },
    {
      title: "Breakout",
      path: "/breakout",
      image: "/lovable-uploads/d3999e5b-cbd1-4b45-b9d0-a81d957db05f.png",
    },
    {
      title: "Wordle",
      path: "/wordle",
      image: "/lovable-uploads/ad1db81d-01be-48f7-b121-f94e508c0dbd.png",
    },
    {
      title: "Paper Plane",
      path: "/paper-plane",
      image: "/lovable-uploads/9c1c55a3-3dcf-42f8-98d6-6705f90f72ed.png",
    },
    {
      title: "Dots and Boxes",
      path: "/dots-and-boxes",
      image: "/lovable-uploads/25bab696-524d-44e7-8b57-6a2b3afbac4e.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Arcade Games</h1>
        <p className="text-center text-gray-400 mb-12">Choose a game to play</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <Card key={game.title} className="bg-gray-800 border-gray-700 overflow-hidden hover:scale-105 transition-transform duration-300">
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