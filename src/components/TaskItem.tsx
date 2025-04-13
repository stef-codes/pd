import React, { useState, useEffect } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { Task, AITaskAnalysis } from '../types';
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  Button,
  Box,
  Chip,
  IconButton,
  Collapse,
  TextField,
  CircularProgress,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Add as AddIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

interface TaskItemProps {
  task: Task;
}

const getProcrastinationColor = (level: 'low' | 'medium' | 'high') => {
  switch (level) {
    case 'low': return 'success';
    case 'medium': return 'warning';
    case 'high': return 'error';
  }
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTask, addSubtask, toggleSubtask, getProcrastinationAnalysis, generateTaskOutline } = useTasks();
  const [expanded, setExpanded] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [analysis, setAnalysis] = useState<AITaskAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outlineModalOpen, setOutlineModalOpen] = useState(false);
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);

  useEffect(() => {
    if (expanded && !analysis) {
      setLoading(true);
      setError(null);
      getProcrastinationAnalysis(task.id)
        .then(setAnalysis)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [expanded, task.id, getProcrastinationAnalysis]);

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      addSubtask(task.id, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
      setShowSubtaskInput(false);
    }
  };

  const handleGenerateOutline = async () => {
    setLoading(true);
    setError(null);
    try {
      const newAnalysis = await generateTaskOutline(task.id);
      console.log('New analysis:', newAnalysis); // Debug log
      setAnalysis(newAnalysis);
      setOutlineModalOpen(true);
    } catch (err) {
      console.error('Error generating outline:', err); // Debug log
      setError(err instanceof Error ? err.message : 'Failed to generate outline');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseOutlineModal = () => {
    setOutlineModalOpen(false);
  };

  const daysIncomplete = Math.floor((new Date().getTime() - task.createdAt.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <>
      <Card 
        sx={{ 
          mb: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'primary.main',
          borderRadius: 2
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                onClick={() => toggleTask(task.id)}
                sx={{ 
                  color: task.completed ? 'success.main' : 'primary.main',
                  '&:hover': { bgcolor: 'rgba(156, 39, 176, 0.1)' }
                }}
              >
                <CheckIcon />
              </IconButton>
              <Typography 
                variant="h6" 
                sx={{ 
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'text.secondary' : 'text.primary'
                }}
              >
                {task.title}
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setExpanded(!expanded)}
              sx={{ 
                color: 'primary.main',
                '&:hover': { bgcolor: 'rgba(156, 39, 176, 0.1)' }
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          <Collapse in={expanded}>
            <Box sx={{ mt: 2, pl: 4 }}>
              {task.description && (
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ mb: 2 }}
                >
                  {task.description}
                </Typography>
              )}

              {task.dueDate && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Due: {formatDate(task.dueDate)}
                </Typography>
              )}

              {task.analysis && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Coach's Analysis
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontStyle: 'italic',
                      color: 'primary.main',
                      fontWeight: 'medium',
                      mb: 1
                    }}
                  >
                    "{task.analysis.motivationalMessage}"
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ whiteSpace: 'pre-line' }}
                  >
                    {task.analysis.detailedAnalysis}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip 
                      label={`${task.analysis.daysIncomplete} days incomplete`}
                      color={getProcrastinationColor(task.analysis.procrastinationLevel)}
                      size="small"
                    />
                    <Chip 
                      label={`${task.analysis.procrastinationLevel} procrastination`}
                      color={getProcrastinationColor(task.analysis.procrastinationLevel)}
                      size="small"
                    />
                  </Box>
                </Box>
              )}

              {task.analysis?.suggestedOutline && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Suggested Outline
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Estimated Time: {task.analysis.suggestedOutline.estimatedTime}
                  </Typography>
                  <List dense>
                    {task.analysis.suggestedOutline.steps.map((step, index) => (
                      <ListItem key={index}>
                        <ListItemText 
                          primary={step}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="subtitle2" color="primary" sx={{ mt: 1 }}>
                    Key Milestones
                  </Typography>
                  <List dense>
                    {task.analysis.suggestedOutline.keyMilestones.map((milestone, index) => (
                      <ListItem key={index}>
                        <ListItemText 
                          primary={milestone}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Subtasks
                </Typography>
                <List dense>
                  {task.subtasks.map(subtask => (
                    <ListItem 
                      key={subtask.id}
                      sx={{ 
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <IconButton 
                          size="small" 
                          onClick={() => toggleSubtask(task.id, subtask.id)}
                          sx={{ 
                            color: subtask.completed ? 'success.main' : 'primary.main',
                            mr: 1
                          }}
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                        <ListItemText 
                          primary={subtask.title}
                          sx={{ 
                            textDecoration: subtask.completed ? 'line-through' : 'none',
                            color: subtask.completed ? 'text.secondary' : 'text.primary'
                          }}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>

                {showSubtaskInput ? (
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      placeholder="Add a subtask"
                      variant="outlined"
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
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={handleAddSubtask}
                      sx={{ minWidth: 'auto' }}
                    >
                      Add
                    </Button>
                  </Box>
                ) : (
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => setShowSubtaskInput(true)}
                    sx={{ mt: 1 }}
                  >
                    Add Subtask
                  </Button>
                )}
              </Box>

              {!task.analysis && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleGenerateOutline}
                  sx={{ mt: 1 }}
                >
                  Generate Task Outline
                </Button>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      <Dialog
        open={outlineModalOpen}
        onClose={handleCloseOutlineModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Action Plan for "{task.title}"
        </DialogTitle>
        <DialogContent>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {analysis?.suggestedOutline && (
            <Box sx={{ mt: 2 }}>
              <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Estimated Time
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {analysis.suggestedOutline.estimatedTime}
                </Typography>
                
                <Typography variant="subtitle1" gutterBottom>
                  Steps to Completion
                </Typography>
                <Box component="ol" sx={{ pl: 2, mb: 3 }}>
                  {analysis.suggestedOutline.steps.map((step: string, index: number) => (
                    <Typography 
                      key={index} 
                      component="li" 
                      variant="body1"
                      sx={{ mb: 1 }}
                    >
                      {step}
                    </Typography>
                  ))}
                </Box>

                <Typography variant="subtitle1" gutterBottom>
                  Key Milestones
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {analysis.suggestedOutline.keyMilestones.map((milestone: string, index: number) => (
                    <Typography 
                      key={index} 
                      component="li" 
                      variant="body1"
                      sx={{ mb: 1 }}
                    >
                      {milestone}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOutlineModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskItem; 