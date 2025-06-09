#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import Conf from 'conf';

// 初始化配置存储
const config = new Conf({
  projectName: 'task-tracker',
  schema: {
    tasks: {
      type: 'array',
      default: []
    }
  }
});

// 定义任务类型
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

// 创建命令行程序
const program = new Command();

program
  .name('task-tracker')
  .description('A CLI tool for managing tasks')
  .version('1.0.0');

// 添加任务命令
program
  .command('add')
  .description('Add a new task')
  .action(async () => {
    const spinner = ora('Adding new task...').start();
    
    try {
      spinner.stop();
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Task title:',
          validate: (input) => input.trim() !== '' || 'Title is required'
        },
        {
          type: 'input',
          name: 'description',
          message: 'Task description:'
        }
      ]);

      const tasks = config.get('tasks') as Task[];
      const newTask: Task = {
        id: Date.now().toString(),
        title: answers.title,
        description: answers.description,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      config.set('tasks', [...tasks, newTask]);
      
      spinner.succeed(chalk.green('Task added successfully!'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to add task'));
      console.error(error);
    }
  });

// 列出任务命令
program
  .command('list')
  .description('List all tasks')
  .action(() => {
    const tasks = config.get('tasks') as Task[];
    
    if (tasks.length === 0) {
      console.log(chalk.yellow('No tasks found.'));
      return;
    }

    console.log(chalk.blue('\nYour Tasks:'));
    tasks.forEach((task) => {
      const status = task.status === 'completed' 
        ? chalk.green('✓') 
        : chalk.yellow('○');
      console.log(`
${status} ${chalk.bold(task.title)}
   Description: ${task.description}
   Created: ${new Date(task.createdAt).toLocaleString()}
   Status: ${chalk.italic(task.status)}
      `);
    });
  });

// 完成任务命令
program
  .command('complete')
  .description('Mark a task as completed')
  .action(async () => {
    const tasks = config.get('tasks') as Task[];
    const pendingTasks = tasks.filter(task => task.status === 'pending');

    if (pendingTasks.length === 0) {
      console.log(chalk.yellow('No pending tasks found.'));
      return;
    }

    const { taskId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'taskId',
        message: 'Select task to complete:',
        choices: pendingTasks.map(task => ({
          name: task.title,
          value: task.id
        }))
      }
    ]);

    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const }
        : task
    );

    config.set('tasks', updatedTasks);
    console.log(chalk.green('Task marked as completed!'));
  });

// 删除任务命令
program
  .command('delete')
  .description('Delete a task')
  .action(async () => {
    const tasks = config.get('tasks') as Task[];
    
    if (tasks.length === 0) {
      console.log(chalk.yellow('No tasks found.'));
      return;
    }

    const { taskId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'taskId',
        message: 'Select task to delete:',
        choices: tasks.map(task => ({
          name: task.title,
          value: task.id
        }))
      }
    ]);

    const updatedTasks = tasks.filter(task => task.id !== taskId);
    config.set('tasks', updatedTasks);
    console.log(chalk.green('Task deleted successfully!'));
  });

program.parse();