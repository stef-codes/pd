import React, { useState, useEffect } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { Task } from '../types';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { format } from 'date-fns';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTask, addSubtask, toggleSubtask, getProcrastinationAnalysis, generateTaskOutline } = useTasks();
  const [expanded, setExpanded] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [analysis, setAnalysis] = useState<AITaskAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outlineModalOpen, setOutlineModalOpen] = useState(false);

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

  const getProcrastinationColor = (level: string) => {
    switch (level) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      addSubtask(task.id, newSubtaskTitle);
      setNewSubtaskTitle('');
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

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Checkbox
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="div">
                {task.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created: {format(task.createdAt, 'MMM d, yyyy')}
              </Typography>
              {task.description && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {task.description}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<LightbulbIcon />}
                onClick={handleGenerateOutline}
                disabled={loading}
              >
                Generate Outline
              </Button>
              <IconButton onClick={() => setExpanded(!expanded)}>
                <ExpandMoreIcon />
              </IconButton>
            </Box>
          </Box>

          <Collapse in={expanded}>
            <Box sx={{ mt: 2 }}>
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

              {analysis && (
                <>
                  <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Coach's Analysis
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 2, 
                        fontStyle: 'italic',
                        color: 'primary.main',
                        fontWeight: 'medium'
                      }}
                    >
                      "{analysis.motivationalMessage}"
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'text.secondary',
                        whiteSpace: 'pre-line',
                        mb: 2
                      }}
                    >
                      {analysis.detailedAnalysis}
                    </Typography>
                  </Paper>

                  {analysis.suggestedOutline && (
                    <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Suggested Action Plan
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Estimated Time: {analysis.suggestedOutline.estimatedTime}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Steps to Completion
                        </Typography>
                        <Box component="ol" sx={{ pl: 2 }}>
                          {analysis.suggestedOutline.steps.map((step, index) => (
                            <Typography 
                              key={index} 
                              component="li" 
                              variant="body2"
                              sx={{ mb: 1 }}
                            >
                              {step}
                            </Typography>
                          ))}
                        </Box>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Key Milestones
                        </Typography>
                        <Box component="ul" sx={{ pl: 2 }}>
                          {analysis.suggestedOutline.keyMilestones.map((milestone, index) => (
                            <Typography 
                              key={index} 
                              component="li" 
                              variant="body2"
                              sx={{ mb: 1 }}
                            >
                              {milestone}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    </Paper>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Procrastination Level
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={`${analysis.daysIncomplete} days incomplete`}
                        color={getProcrastinationColor(analysis.procrastinationLevel)}
                      />
                      <Chip
                        label={`Level: ${analysis.procrastinationLevel}`}
                        color={getProcrastinationColor(analysis.procrastinationLevel)}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Suggested Action Plan
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {analysis.suggestedSubtasks.map((suggestion, index) => (
                        <Chip
                          key={index}
                          label={suggestion}
                          variant="outlined"
                          onClick={() => setNewSubtaskTitle(suggestion)}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      size="small"
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      placeholder="Add subtask"
                      fullWidth
                    />
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddSubtask}
                    >
                      Add
                    </Button>
                  </Box>

                  {task.subtasks.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Current Subtasks
                      </Typography>
                      {task.subtasks.map((subtask) => (
                        <Box
                          key={subtask.id}
                          sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                        >
                          <Checkbox
                            checked={subtask.completed}
                            onChange={() => toggleSubtask(task.id, subtask.id)}
                            size="small"
                          />
                          <Typography variant="body2">
                            {subtask.title}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </>
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
                  {analysis.suggestedOutline.steps.map((step, index) => (
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
                  {analysis.suggestedOutline.keyMilestones.map((milestone, index) => (
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