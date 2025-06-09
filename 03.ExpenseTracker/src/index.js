#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/expenses.json');

// Initialize data file
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ expenses: [], nextId: 1 }));
}

program
  .version('1.0.0')
  .description('Expense Tracker CLI');

program
  .command('add')
  .description('Add a new expense')
  .requiredOption('--description <description>', 'Expense description')
  .requiredOption('--amount <amount>', 'Expense amount', parseFloat)
  .action((options) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    const expense = {
      id: data.nextId,
      date: new Date().toISOString().split('T')[0],
      description: options.description,
      amount: options.amount
    };
    data.expenses.push(expense);
    data.nextId += 1;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log(`Expense added successfully (ID: ${expense.id})`);
  });

program
  .command('list')
  .description('List all expenses')
  .action(() => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    console.log('ID  Date       Description  Amount');
    console.table(data.expenses)
    data.expenses.forEach(expense => {
      console.log(`${expense.id.toString().padEnd(3)} ${expense.date}  ${expense.description.padEnd(12)} $${expense.amount.toFixed(2)}`);
    });
  });

program
  .command('delete')
  .description('Delete an expense')
  .requiredOption('--id <id>', 'Expense ID', parseInt)
  .action((options) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    const index = data.expenses.findIndex(expense => expense.id === options.id);
    if (index === -1) {
      console.error(`Error: Expense with ID ${options.id} not found`);
      process.exit(1);
    }
    data.expenses.splice(index, 1);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('Expense deleted successfully');
  });

program
  .command('summary')
  .description('Show expense summary')
  .option('--month <month>', 'Month number (1-12)', parseInt)
  .action((options) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    let filteredExpenses = data.expenses;
    
    if (options.month) {
      const currentYear = new Date().getFullYear();
      filteredExpenses = data.expenses.filter(expense => {
        const [year, month] = expense.date.split('-');
        return year === currentYear.toString() && parseInt(month) === options.month;
      });
    }

    const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    if (options.month) {
      const monthName = new Date(2000, options.month - 1).toLocaleString('default', { month: 'long' });
      console.log(`Total expenses for ${monthName}: $${total.toFixed(2)}`);
    } else {
      console.log(`Total expenses: $${total.toFixed(2)}`);
    }
  });

program.parse(process.argv);