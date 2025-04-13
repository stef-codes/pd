export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  completed: boolean;
  completedAt?: Date;
  dueDate?: Date;
  subtasks: Subtask[];
  analysis?: AITaskAnalysis;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface ProcrastinationAnalysis {
  taskId: string;
  daysIncomplete: number;
  suggestedSubtasks: string[];
  procrastinationLevel: 'low' | 'medium' | 'high';
  motivationalMessage: string;
}

export interface AITaskAnalysis {
  procrastinationLevel: 'low' | 'medium' | 'high';
  daysIncomplete: number;
  suggestedSubtasks: string[];
  motivationalMessage: string;
  detailedAnalysis: string;
  suggestedOutline: {
    steps: string[];
    estimatedTime: string;
    keyMilestones: string[];
  };
} 