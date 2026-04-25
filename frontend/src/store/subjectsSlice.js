import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

const initialState = {
  items: [],

  subjectStatus: "idle",
  listSubjectsStatus: "idle",
  updateTaskStatusById: {},
  status: "idle",
  updateStatus: "idle",
  createStatus: "idle",
  createTest: "idle",

  error: null,
  subject: null,
};

export const createTest = createAsyncThunk(
  "subject/createTest",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("api/tasks/create/", credentials);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Ошибка при сохранении пробника",
      );
    }
  },
);

export const updateTask = createAsyncThunk(
  "subjects/updateTask",
  async ({ taskId }, { rejectWithValue }) => {
    try {
      const response = await api.post("api/tasks/review/", {
        task_id: taskId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Ошибка при обновлении задания",
      );
    }
  },
);

export const getSubject = createAsyncThunk(
  "subjects/getSubject",
  async (subjectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/subjects/getSubject/${subjectId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Ошибка при получении предмета",
      );
    }
  },
);

export const getSubjects = createAsyncThunk(
  "subjects/getSubjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/subjects/mySubjects/");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Ошибка при получении предметов",
      );
    }
  },
);

export const updateSubjects = createAsyncThunk(
  "subjects/updateSubjects",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        "/api/subjects/update/",
        credentials,
        {},
      );
      console.log(response);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Ошибка при изменении предметов",
      );
    }
  },
);

export const createSubjects = createAsyncThunk(
  "subjects/createSubjects",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/subjects/setup/", credentials, {});
      console.log(response);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Ошибка при создании предметов",
      );
    }
  },
);

const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateStatus = "idle";
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (buidler) => {
    buidler
      .addCase(createSubjects.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })
      .addCase(createSubjects.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
      })
      .addCase(createSubjects.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload || "Ошибка при создании предметов";
      })
      .addCase(updateSubjects.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })
      .addCase(updateSubjects.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
      })
      .addCase(updateSubjects.rejected, (state, action) => {
        state.updateStatus = "failed";
        console.log(action);
        state.error = action.payload || "Ошибка при изменении предметов";
      })
      // Получение предметов
      .addCase(getSubjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getSubjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(getSubjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error || "Ошибка при получении предметов";
      })
      // инфа о предмете
      .addCase(getSubject.pending, (state) => {
        state.subjectStatus = "loading";
        state.error = null;
      })
      .addCase(getSubject.fulfilled, (state, action) => {
        state.subjectStatus = "succeeded";
        state.subject = action.payload;
        console.log(action);
      })
      .addCase(getSubject.rejected, (state, action) => {
        state.subjectStatus = "failed";
        state.error = action.error || "Ошибка при получении предмета";
      })
      // обновление задачи
      .addCase(updateTask.pending, (state, action) => {
        const taskId = action.meta.arg.taskId;
        state.updateTaskStatusById[taskId] = "loading";
        state.error = null;

        const task = state.subject?.tasks?.find((t) => t.id === taskId);
        if (!task) {
          return;
        }

        if (task._prevUnderstandingPercent == null) {
          task._prevUnderstandingPercent = task.understanding_percent;
        }

        task.understanding_percent = Math.min(
          100,
          task.understanding_percent + 15,
        );
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const taskId = action.payload.task_id;
        state.updateTaskStatusById[taskId] = "succeeded";
        const { task_understanding, subject_understanding } = action.payload;
        const task = state.subject?.tasks?.find((t) => t.id === taskId);

        state.subject.average_understanding = subject_understanding;

        if (task) {
          task.understanding_percent = task_understanding;
          delete task._prevUnderstandingPercent;
        }

        const subjectItem = state.items.find((s) => s.id === state.subject.id);
        if (subjectItem) {
          subjectItem.average_understanding = subject_understanding;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        const taskId = action.meta.arg.taskId;
        state.updateTaskStatusById[taskId] = "failed";
        state.error = action.error || "Ошибка при обновлении предмета";
        const task = state.subject?.tasks?.find((t) => t.id === taskId);
        if (!task) {
          return;
        }
        if (task._prevUnderstandingPercent != null) {
          task.understanding_percent = task._prevUnderstandingPercent;
          delete task._prevUnderstandingPercent;
        }
      })
      // создание пробника
      .addCase(createTest.pending, (state) => {
        state.createTest = "loading";
        state.error = null;
      })
      .addCase(createTest.fulfilled, (state, action) => {
        console.log("createTest fulfilled");
        state.createTest = "succeeded";
        state.subject = action.payload
        console.log(action);
      })
      .addCase(createTest.rejected, (state, action) => {
        state.createTest = "failed";
        state.error = action.error || "Ошибка при создании пробника";
      });
  },
});

export const { clearUpdateStatus, clearError } = subjectsSlice.actions;
export default subjectsSlice.reducer;
