import inquirer from 'inquirer';
import chalk from 'chalk';

// Types
type Difficulty = 'easy' | 'medium' | 'hard';

interface GameConfig {
  maxNumber: number;
  minNumber: number;
  chances: number;
}

interface GameState {
  targetNumber: number;
  attempts: number;
  startTime: number;
  hints: string[];
}

// Game configuration
const DIFFICULTY_CONFIGS: Record<Difficulty, GameConfig> = {
  easy: { maxNumber: 100, minNumber: 1, chances: 10 },
  medium: { maxNumber: 100, minNumber: 1, chances: 5 },
  hard: { maxNumber: 100, minNumber: 1, chances: 3 }
};

// Utility functions
const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateHint = (guess: number, target: number): string => {
  const difference = Math.abs(target - guess);
  if (difference > 50) return "You're way off!";
  if (difference > 25) return "You're getting warmer!";
  if (difference > 10) return "You're getting closer!";
  return "You're very close!";
};

const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
};

// Game class
class NumberGuessingGame {
  private gameState: GameState | null = null;
  private config: GameConfig;
  private highScores: Map<Difficulty, number> = new Map();

  constructor(private difficulty: Difficulty) {
    this.config = DIFFICULTY_CONFIGS[difficulty];
  }

  private initializeGame(): void {
    this.gameState = {
      targetNumber: generateRandomNumber(this.config.minNumber, this.config.maxNumber),
      attempts: 0,
      startTime: Date.now(),
      hints: []
    };
  }

  private async getUserGuess(): Promise<number> {
    const { guess } = await inquirer.prompt([
      {
        type: 'number',
        name: 'guess',
        message: 'Enter your guess:',
        validate: (input: number) => {
          if (isNaN(input)) return 'Please enter a valid number';
          if (input < this.config.minNumber || input > this.config.maxNumber) {
            return `Please enter a number between ${this.config.minNumber} and ${this.config.maxNumber}`;
          }
          return true;
        }
      }
    ]);
    return guess;
  }

  private async playRound(): Promise<boolean> {
    if (!this.gameState) return false;

    const guess = await this.getUserGuess();
    this.gameState.attempts++;
    this.gameState.hints.push(generateHint(guess, this.gameState.targetNumber));

    if (guess === this.gameState.targetNumber) {
      const timeTaken = Date.now() - this.gameState.startTime;
      const currentHighScore = this.highScores.get(this.difficulty) || Infinity;
      
      console.log(chalk.green(`\n🎉 Congratulations! You guessed the correct number in ${this.gameState.attempts} attempts!`));
      console.log(chalk.blue(`⏱️ Time taken: ${formatTime(timeTaken)}`));
      
      if (this.gameState.attempts < currentHighScore) {
        this.highScores.set(this.difficulty, this.gameState.attempts);
        console.log(chalk.yellow('🏆 New high score!'));
      }
      
      return true;
    }

    const remainingChances = this.config.chances - this.gameState.attempts;
    console.log(chalk.red(`\n❌ Incorrect! The number is ${guess < this.gameState.targetNumber ? 'greater' : 'less'} than ${guess}`));
    console.log(chalk.yellow(`💡 Hint: ${this.gameState.hints[this.gameState.hints.length - 1]}`));
    console.log(chalk.blue(`📊 Remaining chances: ${remainingChances}`));

    if (remainingChances === 0) {
      console.log(chalk.red(`\n😢 Game Over! The number was ${this.gameState.targetNumber}`));
      return true;
    }

    return false;
  }

  async start(): Promise<void> {
    console.log(chalk.cyan('\n🎮 Welcome to the Number Guessing Game!'));
    console.log(chalk.cyan(`\nDifficulty: ${chalk.bold(this.difficulty.toUpperCase())}`));
    console.log(chalk.cyan(`You have ${this.config.chances} chances to guess a number between ${this.config.minNumber} and ${this.config.maxNumber}`));
    
    this.initializeGame();
    
    while (this.gameState) {
      const isGameOver = await this.playRound();
      if (isGameOver) break;
    }
  }
}

// Main game loop
async function main() {
  while (true) {
    const { difficulty } = await inquirer.prompt([
      {
        type: 'list',
        name: 'difficulty',
        message: 'Select difficulty level:',
        choices: [
          { name: 'Easy (10 chances)', value: 'easy' },
          { name: 'Medium (5 chances)', value: 'medium' },
          { name: 'Hard (3 chances)', value: 'hard' }
        ]
      }
    ]);

    const game = new NumberGuessingGame(difficulty);
    await game.start();

    const { playAgain } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'playAgain',
        message: 'Would you like to play again?',
        default: true
      }
    ]);

    if (!playAgain) {
      console.log(chalk.cyan('\n👋 Thanks for playing! Goodbye!'));
      break;
    }
  }
}

// Start the game
main().catch(console.error);