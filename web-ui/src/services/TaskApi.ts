// src/services/TaskApi.ts

import axios from 'axios';
import { Task, TaskExecution, TaskPayload } from '../types/TaskTypes';

const API_BASE_URL = 'http://localhost:8080/api/tasks';

export const TaskApi = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await axios.get<Task[]>(API_BASE_URL);
    return response.data;
  },
  searchTasksByName: async (searchName: string): Promise<Task[]> => {
    const response = await axios.get<Task[]>(`${API_BASE_URL}/search`, {
      params: { name: searchName },
    });
    return response.data;
  },
  createOrUpdateTask: async (payload: TaskPayload): Promise<Task> => {
    const response = await axios.put<Task>(API_BASE_URL, payload);
    return response.data;
  },
  deleteTask: async (taskId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${taskId}`);
  },
  runTask: async (taskId: string): Promise<TaskExecution> => {
    const response = await axios.put<TaskExecution>(`${API_BASE_URL}/${taskId}/execute`);
    return response.data;
  },
};