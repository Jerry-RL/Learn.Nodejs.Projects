import * as fs from "fs";
import * as path from "path";
// import { fileURLToPath } from 'url';

type ITaskStatus = "todo" | "in-progress" | "done";
interface ITask {
  id: string;
  description: string;
  status: ITaskStatus;
  createdAt: string;
  updatedAt?: string;
}

class TaskTracker {
  private dataPath: string;
  private tasks: ITask[];

  constructor() {
    this.dataPath = path.join(process.cwd(), "tasks.json");
    this.tasks = this.loadTasks();
  }
  private loadTasks(): ITask[] {
    try {
      if (fs.existsSync(this.dataPath)) {
        const data = fs.readFileSync(this.dataPath, "utf-8");
        return JSON.parse(data);
      }
      fs.writeFileSync(this.dataPath, JSON.stringify([], null, 2));
      return [];
    } catch (error) {
      console.error("Error loading tasks:", error);
      return [];
    }
  }
  private saveTasks(): void {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(this.tasks, null, 2));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  }
  addTask(description: string) {
    const id = Date.now().toString();
    const task: ITask = {
      id,
      description,
      status: "todo",
      createdAt: new Date().toISOString(),
    };
    console.log(id);
    this.tasks.push(task);
    this.saveTasks();
  }
  updateTask(
    id: string,
    task: {
      description?: string;
      status?: ITaskStatus;
    }
  ) {
    const needUpdateTask = this.tasks.find((t) => t.id === id);
    if (!needUpdateTask) {
      console.warn(`The task with ID ${id} does not exist`);
      return;
    }
    const newTask = {
      ...needUpdateTask,
      ...task,
      updatedAt: new Date().toISOString(),
    };
    this.tasks = this.tasks.map((t) => (t.id === id ? newTask : t));
    this.saveTasks();
    console.log(`The task with ID ${id} has been updated`);
    return newTask;
  }
  markInProgressTask(id: string) {
    this.updateTask(id, { status: "in-progress" });
  }
  completeTask(id: string) {
    this.updateTask(id, { status: "done" });
  }

  deleteTask(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTasks();
  }
  list(status: ITaskStatus | null) {
    if (!status) {
      console.table(this.tasks);
      return this.tasks;
    }
    const filteredTasks = this.tasks.filter((task) => task.status === status);
    console.table(filteredTasks);
    return filteredTasks;
  }
}
function taskCli() {
  const taskTracker = new TaskTracker();
  const args = process.argv.slice(2);
  // console.log(taskTracker)
  // @ts-ignore
  const [command, $value, ...params] = args;
  // 根据命令行参数执行相应操作
  // console.log(args)
  switch (command) {
    case "add":
      taskTracker.addTask($value as string);
      break;

    case "list":
      taskTracker.list($value as ITaskStatus | null);
      break;
    case "update":
      taskTracker.updateTask($value as string, { description: params[0] });
      break;
    case "delete":
      taskTracker.deleteTask($value as string);
      break;
    case "mark-in-progress": {
      taskTracker.markInProgressTask($value as string);
      break;
    }
    case "mark-done":
      taskTracker.completeTask($value as string);
      break;
    case "help":
      const help = `
    Usage: task-tracker <command> [options]
    Commands:
    add <description> - Add a new task
    list [status] - List tasks by status (todo, in-progress, done)
    update <id> <description> - Update a task description
    mark-in-progress <id> - Mark a task as in-progress
    mark-done <id> - Mark a task as done
    delete <id> - Delete a task
    help - Show help
    `;
      console.log(help);
      break;
    default:
      console.log('Unknown command, use "help" to see available commands');
      process.exit(1);
  }
}
export default taskCli;
