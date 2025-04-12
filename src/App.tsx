import { Box, Container, Typography } from '@mui/material'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import PomodoroTimer from './components/PomodoroTimer'
import { TaskProvider } from './contexts/TaskContext'

function App() {
  return (
    <TaskProvider>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Procrastination Detector
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
            Break down your tasks and beat procrastination
          </Typography>
          
          <PomodoroTimer />
          
          <TaskForm />
          <TaskList />
        </Box>
      </Container>
    </TaskProvider>
  )
}

export default App
