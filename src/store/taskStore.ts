import { create } from 'zustand';
import type { Task } from '@app-types';
import { format } from 'date-fns';
import {
  getTasksByDate,
  insertTask,
  updateTask as dbUpdateTask,
  deleteTask as dbDeleteTask,
} from '@database/queries/taskQueries';

interface TaskStore {
  tasks: Task[];
  selectedDate: string;
  activeTab: 'all' | 'completed';
  quickAddOpen: boolean;
  editingTask: Task | null;
  isLoading: boolean;
  setSelectedDate: (date: string) => void;
  setActiveTab: (tab: 'all' | 'completed') => void;
  setQuickAddOpen: (v: boolean) => void;
  setEditingTask: (task: Task | null) => void;
  loadTasks: (date: string) => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  activeTab: 'all',
  quickAddOpen: false,
  editingTask: null,
  isLoading: false,
  setSelectedDate: (date) => set({ selectedDate: date }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setQuickAddOpen: (v) => set({ quickAddOpen: v }),
  setEditingTask: (task) => set({ editingTask: task }),
  loadTasks: async (date) => {
    set({ isLoading: true });
    try {
      const tasks = await getTasksByDate(date);
      set({ tasks });
    } finally {
      set({ isLoading: false });
    }
  },
  addTask: async (task) => {
    await insertTask(task);
    set((state) => ({ tasks: [...state.tasks, task] }));
  },
  updateTask: async (id, updates) => {
    await dbUpdateTask(id, updates);
    set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) }));
  },
  deleteTask: async (id) => {
    await dbDeleteTask(id);
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },
  completeTask: async (id) => {
    const completedAt = new Date().toISOString();
    await dbUpdateTask(id, { completed: true, completedAt });
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: true, completedAt } : t
      ),
    }));
  },
}));
