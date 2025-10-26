import axios from 'axios';
import { TaskItem } from './types';

const api = axios.create({
  baseURL: 'https://task-manager-8ub5.onrender.com',
  headers: { 'Content-Type': 'application/json' }
});

export const getTasks = async (): Promise<TaskItem[]> => {
  const res = await api.get<TaskItem[]>('/api/tasks');
  return res.data;
};

export const addTask = async (description: string) => {
  const res = await api.post<TaskItem>('/api/tasks', { description, isCompleted: false });
  return res.data;
};

export const updateTask = async (task: TaskItem) => {
  await api.put(`/api/tasks/${task.id}`, task);
};

export const deleteTask = async (id: string) => {
  await api.delete(`/api/tasks/${id}`);
};
