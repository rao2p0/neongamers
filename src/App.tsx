import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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
import DotsAndBoxes from "./pages/DotsAndBoxes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
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
          <Route path="/dots-and-boxes" element={<DotsAndBoxes />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;