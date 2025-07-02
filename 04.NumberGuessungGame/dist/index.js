#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
// Game configuration
const DIFFICULTY_CONFIGS = {
    easy: { maxNumber: 100, minNumber: 1, chances: 10 },
    medium: { maxNumber: 100, minNumber: 1, chances: 5 },
    hard: { maxNumber: 100, minNumber: 1, chances: 3 }
};
// Utility functions
const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const generateHint = (guess, target) => {
    const difference = Math.abs(target - guess);
    if (difference > 50)
        return "You're way off!";
    if (difference > 25)
        return "You're getting warmer!";
    if (difference > 10)
        return "You're getting closer!";
    return "You're very close!";
};
const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
};
// Game class
class NumberGuessingGame {
    constructor(difficulty) {
        this.difficulty = difficulty;
        this.gameState = null;
        this.highScores = new Map();
        this.config = DIFFICULTY_CONFIGS[difficulty];
    }
    initializeGame() {
        this.gameState = {
            targetNumber: generateRandomNumber(this.config.minNumber, this.config.maxNumber),
            attempts: 0,
            startTime: Date.now(),
            hints: []
        };
    }
    async getUserGuess() {
        const { guess } = await inquirer_1.default.prompt([
            {
                type: 'number',
                name: 'guess',
                message: 'Enter your guess:',
                validate: (input) => {
                    if (isNaN(input))
                        return 'Please enter a valid number';
                    if (input < this.config.minNumber || input > this.config.maxNumber) {
                        return `Please enter a number between ${this.config.minNumber} and ${this.config.maxNumber}`;
                    }
                    return true;
                }
            }
        ]);
        return guess;
    }
    async playRound() {
        if (!this.gameState)
            return false;
        const guess = await this.getUserGuess();
        this.gameState.attempts++;
        this.gameState.hints.push(generateHint(guess, this.gameState.targetNumber));
        if (guess === this.gameState.targetNumber) {
            const timeTaken = Date.now() - this.gameState.startTime;
            const currentHighScore = this.highScores.get(this.difficulty) || Infinity;
            console.log(chalk_1.default.green(`\n🎉 Congratulations! You guessed the correct number in ${this.gameState.attempts} attempts!`));
            console.log(chalk_1.default.blue(`⏱️ Time taken: ${formatTime(timeTaken)}`));
            if (this.gameState.attempts < currentHighScore) {
                this.highScores.set(this.difficulty, this.gameState.attempts);
                console.log(chalk_1.default.yellow('🏆 New high score!'));
            }
            return true;
        }
        const remainingChances = this.config.chances - this.gameState.attempts;
        console.log(chalk_1.default.red(`\n❌ Incorrect! The number is ${guess < this.gameState.targetNumber ? 'greater' : 'less'} than ${guess}`));
        console.log(chalk_1.default.yellow(`💡 Hint: ${this.gameState.hints[this.gameState.hints.length - 1]}`));
        console.log(chalk_1.default.blue(`📊 Remaining chances: ${remainingChances}`));
        if (remainingChances === 0) {
            console.log(chalk_1.default.red(`\n😢 Game Over! The number was ${this.gameState.targetNumber}`));
            return true;
        }
        return false;
    }
    async start() {
        console.log(chalk_1.default.cyan('\n🎮 Welcome to the Number Guessing Game!'));
        console.log(chalk_1.default.cyan(`\nDifficulty: ${chalk_1.default.bold(this.difficulty.toUpperCase())}`));
        console.log(chalk_1.default.cyan(`You have ${this.config.chances} chances to guess a number between ${this.config.minNumber} and ${this.config.maxNumber}`));
        this.initializeGame();
        while (this.gameState) {
            const isGameOver = await this.playRound();
            if (isGameOver)
                break;
        }
    }
}
// Main game loop
async function main() {
    while (true) {
        const { difficulty } = await inquirer_1.default.prompt([
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
        const { playAgain } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'playAgain',
                message: 'Would you like to play again?',
                default: true
            }
        ]);
        if (!playAgain) {
            console.log(chalk_1.default.cyan('\n👋 Thanks for playing! Goodbye!'));
            break;
        }
    }
}
// Start the game
main().catch(console.error);
