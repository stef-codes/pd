import { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { useTasks } from '../contexts/TaskContext';
import TaskItem from './TaskItem';

const TaskList: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const { tasks } = useTasks();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredTasks = tasks.filter(task => {
    if (tabValue === 0) return !task.completed;
    if (tabValue === 1) return task.completed;
    return true;
  });

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Active" />
          <Tab label="Completed" />
          <Tab label="All" />
        </Tabs>
      </Box>

      {filteredTasks.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center">
          No tasks to display
        </Typography>
      ) : (
        filteredTasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))
      )}
    </>
  );
};

export default TaskList; 