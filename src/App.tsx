import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Tetris from "./pages/Tetris";
import Snake from "./pages/Snake";
import FlappyBird from "./pages/FlappyBird";
import Minesweeper from "./pages/Minesweeper";
import Hangman from "./pages/Hangman";
import TicTacToe from "./pages/TicTacToe";
import Sudoku from "./pages/Sudoku";
import Breakout from "./pages/Breakout";
import Wordle from "./pages/Wordle";
import PaperPlane from "./pages/PaperPlane";
import RockPaperScissors from "./pages/RockPaperScissors";
import TypingRacer from "./pages/TypingRacer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Index />} />
            <Route path="/tetris" element={<Tetris />} />
            <Route path="/snake" element={<Snake />} />
            <Route path="/flappy-bird" element={<FlappyBird />} />
            <Route path="/minesweeper" element={<Minesweeper />} />
            <Route path="/hangman" element={<Hangman />} />
            <Route path="/tic-tac-toe" element={<TicTacToe />} />
            <Route path="/sudoku" element={<Sudoku />} />
            <Route path="/breakout" element={<Breakout />} />
            <Route path="/wordle" element={<Wordle />} />
            <Route path="/paper-plane" element={<PaperPlane />} />
            <Route path="/rock-paper-scissors" element={<RockPaperScissors />} />
            <Route path="/typing-racer" element={<TypingRacer />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;