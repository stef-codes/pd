import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { TaskProvider } from './contexts/TaskContext';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import PomodoroTimer from './components/PomodoroTimer';
import { Box, Container, Typography } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c27b0', // Purple
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    secondary: {
      main: '#ce93d8', // Light purple
      light: '#e1bee7',
      dark: '#ab47bc',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(156, 39, 176, 0.2)',
          color: '#ce93d8',
          '&.MuiChip-colorSuccess': {
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            color: '#81c784',
          },
          '&.MuiChip-colorError': {
            backgroundColor: 'rgba(244, 67, 54, 0.2)',
            color: '#e57373',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TaskProvider>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                color: 'primary.main',
                textAlign: 'center',
                mb: 4,
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(156, 39, 176, 0.3)'
              }}
            >
              Procrastination Detector
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
              Break down your tasks and beat procrastination
            </Typography>
            <PomodoroTimer />
            <TaskForm />
            <TaskList />
          </Container>
        </Box>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
