import React, { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { TextField, Button, Box, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const TaskForm: React.FC = () => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTask(title, description);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            fullWidth
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ alignSelf: 'flex-end' }}
          >
            Add Task
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default TaskForm; 