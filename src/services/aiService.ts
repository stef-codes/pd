const apiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY;
console.log('API Key loaded:', apiKey ? 'Yes' : 'No');

const API_URL = 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf';

export interface AITaskAnalysis {
  procrastinationLevel: 'low' | 'medium' | 'high';
  suggestedSubtasks: string[];
  motivationalMessage: string;
  detailedAnalysis: string;
  suggestedOutline: {
    steps: string[];
    estimatedTime: string;
    keyMilestones: string[];
  };
}

export const analyzeTask = async (task: {
  title: string;
  description: string;
  createdAt: Date;
  completed: boolean;
}): Promise<AITaskAnalysis> => {
  try {
    console.log('Analyzing task:', task);
    const prompt = `You are a productivity coach helping someone overcome procrastination. Analyze this task and provide a detailed breakdown in JSON format:

Task: {task}

Provide a JSON response with the following structure:
{
  "procrastinationLevel": "low" | "medium" | "high",
  "daysIncomplete": number,
  "suggestedSubtasks": string[],
  "motivationalMessage": string,
  "detailedAnalysis": string,
  "suggestedOutline": {
    "steps": string[],
    "estimatedTime": string,
    "keyMilestones": string[]
  }
}

Rules:
1. procrastinationLevel must be one of: "low", "medium", or "high"
2. daysIncomplete must be a positive number
3. suggestedSubtasks must be an array of 3-5 specific, actionable subtasks
4. motivationalMessage should be 1-2 sentences of direct, tactical advice
5. detailedAnalysis should be 3-4 sentences explaining the task's challenges and strategies
6. suggestedOutline must include:
   - steps: 5 specific, sequential steps to complete the task
   - estimatedTime: a realistic time estimate (e.g., "2 hours", "3 days", "1 week")
   - keyMilestones: 3-4 important checkpoints to track progress

IMPORTANT: Return ONLY the JSON object, with no additional text or explanations.`;

    console.log('Sending prompt to AI:', prompt);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('AI Response:', data);

    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid response format from AI');
    }

    const content = data[0]?.generated_text;
    if (!content) {
      throw new Error('No content in AI response');
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const result = JSON.parse(jsonMatch[0]);
    console.log('Parsed result:', result);

    // Validate the result structure
    if (!result.procrastinationLevel || !result.suggestedSubtasks || !result.motivationalMessage || 
        !result.detailedAnalysis || !result.suggestedOutline) {
      throw new Error('Invalid response structure');
    }

    return result as AITaskAnalysis;
  } catch (error) {
    console.error('AI analysis failed:', error);
    // Return default values if AI fails
    return {
      procrastinationLevel: 'medium',
      suggestedSubtasks: [
        'Break down into smaller steps',
        'Set a specific deadline',
        'Identify potential obstacles',
      ],
      motivationalMessage: 'You can do this! Take it one step at a time.',
      detailedAnalysis: 'This task requires careful planning and execution. Consider breaking it down into smaller, manageable parts and setting specific deadlines for each component.',
      suggestedOutline: {
        steps: [
          'Break down the task into smaller components',
          'Prioritize the components by importance',
          'Set specific deadlines for each component',
          'Work on one component at a time',
          'Review and adjust the plan as needed'
        ],
        estimatedTime: '1 week',
        keyMilestones: [
          'Complete initial planning',
          'Finish first major component',
          'Complete final review'
        ]
      }
    };
  }
}; 