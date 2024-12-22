import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useSessionContext();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  const handleGameClick = (path: string) => {
    const hasPlayedGame = localStorage.getItem('hasPlayedGame');
    
    if (!session) {
      if (!hasPlayedGame) {
        // First time playing, allow access and set flag
        localStorage.setItem('hasPlayedGame', 'true');
        navigate(path);
      } else {
        // Already played one game, require login
        toast({
          title: "Login Required",
          description: "You've played your first game! Please log in to continue playing.",
          action: (
            <Button 
              onClick={() => navigate("/auth")}
              variant="default"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Login
            </Button>
          ),
        });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Arcade Games</h1>
          {session ? (
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="text-white hover:text-gray-900"
            >
              Sign Out
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => navigate("/auth")}
              className="text-white hover:text-gray-900"
            >
              Sign In
            </Button>
          )}
        </div>
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
                  onClick={() => handleGameClick(game.path)}
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