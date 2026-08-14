import { TASK_PRIORITIES, DEFAULT_PRIORITY } from "../features/tasks/taskConstants";

export function normalizePriority(priority) {
  if (TASK_PRIORITIES.includes(priority)) {
    return priority;
  }
  return DEFAULT_PRIORITY;
}

export function filterTasksByPriority(tasks, priorityFilter) {
  if (!priorityFilter || priorityFilter === "All") {
    return tasks;
  }
  return tasks.filter((task) => task.priority === priorityFilter);
}
