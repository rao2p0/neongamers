export type Choice = "rock" | "paper" | "scissors";
export type Result = "win" | "lose" | "tie";

export const getWinner = (playerChoice: Choice, computerChoice: Choice): Result => {
  if (playerChoice === computerChoice) return "tie";
  
  const winningCombos = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper",
  };
  
  return winningCombos[playerChoice] === computerChoice ? "win" : "lose";
};