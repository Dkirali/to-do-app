import { create } from 'zustand';
import type { Task } from '@app-types/index';
import { format } from 'date-fns';

interface TaskStore {
  tasks: Task[];
  selectedDate: string;
  activeTab: 'all' | 'completed';
  setSelectedDate: (date: string) => void;
  setActiveTab: (tab: 'all' | 'completed') => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  activeTab: 'all',
  setSelectedDate: (date) => set({ selectedDate: date }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),
  deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  completeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: true, completedAt: new Date().toISOString() } : t
      ),
    })),
}));
