import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const POMODORO_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes in seconds
const LONG_BREAK_TIME = 15 * 60; // 15 minutes in seconds

const PomodoroTimer: React.FC = () => {
  const [time, setTime] = useState(POMODORO_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [pomodoroCount, setPomodoroCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      if (mode === 'pomodoro') {
        setPomodoroCount((count) => count + 1);
        if (pomodoroCount % 3 === 2) {
          setMode('longBreak');
          setTime(LONG_BREAK_TIME);
        } else {
          setMode('shortBreak');
          setTime(SHORT_BREAK_TIME);
        }
      } else {
        setMode('pomodoro');
        setTime(POMODORO_TIME);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, mode, pomodoroCount]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(POMODORO_TIME);
    setMode('pomodoro');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getModeColor = () => {
    switch (mode) {
      case 'pomodoro':
        return 'primary.main';
      case 'shortBreak':
        return 'success.main';
      case 'longBreak':
        return 'info.main';
    }
  };

  const getModeText = () => {
    switch (mode) {
      case 'pomodoro':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        maxWidth: 300,
        mx: 'auto',
        mt: 2,
        mb: 4
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 1,
          color: getModeColor()
        }}
      >
        {getModeText()}
      </Typography>
      
      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
        <CircularProgress
          variant="determinate"
          value={(time / (mode === 'pomodoro' ? POMODORO_TIME : mode === 'shortBreak' ? SHORT_BREAK_TIME : LONG_BREAK_TIME)) * 100}
          size={120}
          thickness={4}
          sx={{ color: getModeColor() }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h4"
            component="div"
            sx={{ color: getModeColor() }}
          >
            {formatTime(time)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          startIcon={isActive ? <PauseIcon /> : <PlayArrowIcon />}
          onClick={toggleTimer}
          size="small"
          sx={{ minWidth: 100 }}
        >
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={resetTimer}
          size="small"
          sx={{ minWidth: 100 }}
        >
          Reset
        </Button>
      </Box>

      <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
        Pomodoros: {pomodoroCount}
      </Typography>
    </Paper>
  );
};

export default PomodoroTimer; 