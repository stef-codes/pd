import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, Subtask, ProcrastinationAnalysis, AITaskAnalysis } from '../types';
import { differenceInDays } from 'date-fns';
import { analyzeTask } from '../services/aiService';

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, description: string) => void;
  toggleTask: (id: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  getProcrastinationAnalysis: (taskId: string) => Promise<AITaskAnalysis>;
  generateTaskOutline: (taskId: string) => Promise<AITaskAnalysis>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = useCallback((title: string, description: string) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      createdAt: new Date(),
      completed: false,
      subtasks: [],
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date() : undefined,
        };
      }
      return task;
    }));
  }, []);

  const addSubtask = useCallback((taskId: string, title: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newSubtask: Subtask = {
          id: uuidv4(),
          title,
          completed: false,
        };
        return {
          ...task,
          subtasks: [...task.subtasks, newSubtask],
        };
      }
      return task;
    }));
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.map(subtask => {
            if (subtask.id === subtaskId) {
              return { ...subtask, completed: !subtask.completed };
            }
            return subtask;
          }),
        };
      }
      return task;
    }));
  }, []);

  const getProcrastinationAnalysis = useCallback(async (taskId: string): Promise<AITaskAnalysis> => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');

    const daysIncomplete = differenceInDays(new Date(), task.createdAt);
    const aiAnalysis = await analyzeTask(task);

    return {
      ...aiAnalysis,
      daysIncomplete,
    };
  }, [tasks]);

  const generateTaskOutline = async (taskId: string): Promise<AITaskAnalysis> => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');

    try {
      const analysis = await getProcrastinationAnalysis(taskId);
      const updatedTasks = tasks.map(t => 
        t.id === taskId 
          ? { 
              ...t, 
              analysis 
            }
          : t
      );
      setTasks(updatedTasks);
      return analysis;
    } catch (error) {
      console.error('Failed to generate outline:', error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      toggleTask,
      addSubtask,
      toggleSubtask,
      getProcrastinationAnalysis,
      generateTaskOutline
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}; 