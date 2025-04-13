import React, { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const TaskForm = () => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    setTitle('');
    setDueDate('');
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 4,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'primary.main',
        borderRadius: 2
      }}
    >
      <Typography variant="h6" gutterBottom color="primary">
        Add New Task
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            fullWidth
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'primary.main',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.light',
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Due Date (YYYY-MM-DD)"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'primary.main',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.light',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ 
              minWidth: { xs: '100%', sm: 'auto' },
              height: '56px'
            }}
          >
            Add Task
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default TaskForm; 