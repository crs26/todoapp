import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const api: string = 'http://localhost:8000/api/v1/'

interface Task {
    id: number
    title: string
    description: string
    isCompleted: boolean
    dateCompleted: Date
    dateCreated: Date
}

interface TodoState {
    tasks: Task[]
    loading: boolean
    error: string | null
}

// Define inital state
const initialState: TodoState = {
    tasks: [], // Array to store tasks
    loading: false,
    error: null
}

// Async actions to interact with the backend API
export const fetchTasks = createAsyncThunk('todos/fetchTasks', async () => {
    const response = await axios.get<Task[]>(api+'task');
    return response.data;
  });
  
  export const addTaskToServer = createAsyncThunk('todos/addTaskToServer', async (title: string) => {
    const response = await axios.post<Task>(api+'task', { title });
    return response.data;
  });
  
  export const toggleTaskOnServer = createAsyncThunk('todos/toggleTaskOnServer', async (id: number) => {
    const response = await axios.patch<Task>(`${api}task/${id}`, { completed: true });
    return response.data;
  });
  
  export const deleteTaskFromServer = createAsyncThunk('todos/deleteTaskFromServer', async (id: number) => {
    await axios.delete(`${api}tasks/${id}`);
    return id;
  });
  

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Task>) => {}
    },
    extraReducers: (builder) => {
        // Fetch tasks
    builder.addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      });
      builder.addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      });
  
      // Add task
      builder.addCase(addTaskToServer.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      });
  
      // Toggle task
      builder.addCase(toggleTaskOnServer.fulfilled, (state, action: PayloadAction<Task>) => {
        const task = state.tasks.find(task => task.id === action.payload.id);
        if (task) {
          task.isCompleted = action.payload.isCompleted;
        }
      });
  
      // Delete task
      builder.addCase(deleteTaskFromServer.fulfilled, (state, action: PayloadAction<number>) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      });
    }
})

// Exporting reducer
export default todoSlice.reducer;