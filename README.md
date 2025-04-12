# Procrastination Detector

A productivity app that helps you break down tasks and overcome procrastination using AI-powered analysis (via Cerebras Inference API) and a built-in Pomodoro timer.

## Features

- **AI-Powered Task Analysis (Cerebras Inference API)**
  - Identifies procrastination patterns
  - Suggests specific subtasks
  - Provides motivational messages
  - Generates detailed action plans
  - Uses advanced language understanding for personalized task analysis

- **Smart Task Management**
  - Create and track tasks
  - Break down tasks into subtasks
  - Filter tasks by status (Active/Completed/All)
  - View task analysis and progress

- **Pomodoro Timer**
  - 25-minute focus sessions
  - 5-minute short breaks
  - 15-minute long breaks
  - Automatic session transitions
  - Visual progress indicator

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- A Hugging Face API key (for Cerebras Inference API access)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/procrastination-detector.git
   cd procrastination-detector
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your Hugging Face API key:
   ```
   VITE_HUGGING_FACE_API_KEY=your_api_key_here
   ```

### Running the App

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

## How to Use

### Creating Tasks
1. Enter a task title and description
2. Click "Add Task" to create a new task
3. The Cerebras AI will automatically analyze the task and provide:
   - Procrastination level assessment
   - Suggested subtasks
   - Motivational message
   - Detailed analysis of task challenges
   - Personalized action plan

### Using the Pomodoro Timer
1. Click "Start" to begin a focus session
2. Work on your task for 25 minutes
3. Take a 5-minute break when the timer ends
4. After 3 focus sessions, take a 15-minute break
5. Use the "Reset" button to start over

### Managing Tasks
- Click the expand button to view task details
- Check off subtasks as you complete them
- Use the tabs to filter tasks by status
- Click "Generate Outline" to get a detailed action plan from the AI

## Technologies Used

- React
- TypeScript
- Material-UI
- Hugging Face Cerebras Inference API
- Vite

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
