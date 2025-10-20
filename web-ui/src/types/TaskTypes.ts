// src/types/TaskTypes.ts

export interface TaskExecution {
  startTime: string; // ISO 8601 String
  endTime: string;   // ISO 8601 String
  output: string;
}

export interface Task {
  id: string; 
  name: string;
  owner: string;
  command: string;
  taskExecutions: TaskExecution[];
}

export type TaskPayload = Omit<Task, 'taskExecutions'>;