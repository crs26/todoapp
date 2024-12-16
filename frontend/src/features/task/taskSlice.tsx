import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig } from "axios";

const api: string =
  import.meta.env.API_ENDPOINT || "https://dromic.csalvadora.com/api/";

export interface Task {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  dateCompleted: Date;
  dateCreated: Date;
}

interface Filter {
  completed: boolean | null;
}

interface NewTask {
  title: string;
  description: string;
}

interface TodoState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

// Define initial state
const initialState: TodoState = {
  tasks: [],
  loading: false,
  error: null,
};

// Async actions to interact with the backend API
export const fetchTasks = createAsyncThunk(
  "todos/fetchTasks",
  async (payload: Filter, { getState }) => {
    const state: any = getState(); // Access Redux state
    const token = state.auth.accessToken; // Get the token from auth state

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    let urlParam = "";
    if (payload.completed != null) {
      urlParam = "?completed=" + payload.completed;
    }
    const response = await axios.get<Task[]>(`${api}task/${urlParam}`, config);
    return response.data;
  }
);

export const addNewTask = createAsyncThunk(
  "todos/addNewTask",
  async (payload: NewTask, { getState }) => {
    const state: any = getState(); // Access Redux state
    const token = state.auth.accessToken; // Get the token from auth state

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post<Task>(api + "task/", payload, config);
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  "todos/updateTask",
  async (task: Task, { getState }) => {
    const state: any = getState(); // Access Redux state
    const token = state.auth.accessToken; // Get the token from auth state

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post<Task>(
      `${api}task/${task.id}/`,
      {
        title: task.title,
        description: task.description,
        is_completed: task.is_completed,
      },
      config
    );
    return response.data;
  }
);

export const deleteTask = createAsyncThunk(
  "todos/deleteTask",
  async (id: number, { getState }) => {
    const state: any = getState(); // Access Redux state
    const token = state.auth.accessToken; // Get the token from auth state

    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`${api}task/${id}`, config);
    return id;
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTask(state, action: PayloadAction<Task>) {
      const index = state.tasks.findIndex(
        (task) => task.id == action.payload.id
      );
      state.tasks[index] = action.payload;
    },
    resetTasks(state) {
      state.tasks = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchTasks.fulfilled,
      (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      }
    );
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch tasks";
    });

    // Add task
    builder.addCase(
      addNewTask.fulfilled,
      (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      }
    );

    // Toggle task
    builder.addCase(
      updateTask.fulfilled,
      (state, action: PayloadAction<Task>) => {
        const task = state.tasks.find((task) => task.id === action.payload.id);
        if (task) {
          task.is_completed = action.payload.is_completed;
        }
      }
    );

    // Delete task
    builder.addCase(
      deleteTask.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      }
    );
  },
});

// Exporting reducer
export const { setTask, resetTasks } = todoSlice.actions;
export default todoSlice.reducer;
