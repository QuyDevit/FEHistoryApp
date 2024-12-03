import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../apis/api';

// Thunks for API calls
export const fetchQuestionsByGradeAndChapter = createAsyncThunk(
  'questions/fetchByGradeAndChapter',
  async ({ gradeId, chapterId }, thunkAPI) => {
    try {
      const response = await api.getListQuestionByGradeAndChapter(gradeId, chapterId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchChaptersByGrade = createAsyncThunk(
  'questions/fetchChaptersByGrade',
  async (gradeId, thunkAPI) => {
    try {
      const response = await api.getListChapter(gradeId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Thunk for fetching lesson
export const fetchLesson = createAsyncThunk(
  'questions/fetchLesson',
  async (chapterId, thunkAPI) => {
    try {
      const response = await api.getLesson(chapterId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Add new thunk for getTest
export const fetchTest = createAsyncThunk(
  'questions/fetchTest',
  async (gradeId, thunkAPI) => {
    try {
      const response = await api.getTest(gradeId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Add new thunk for sendAnswer
export const sendAnswer = createAsyncThunk(
  'questions/sendAnswer',
  async ({ testId, questionId, answerId }, thunkAPI) => {
    console.log('=== sendAnswer thunk ===');
    console.log('Sending data:', { testId, questionId, answerId });
    
    try {
      const response = await api.sendAnswer(testId, questionId, answerId);
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const questionSlice = createSlice({
  name: 'questions',
  initialState: {
    questions: [],
    chapters: [],
    lesson: null,
    test: null, 
    loading: false,
    error: null,
    submittingAnswer: false,
    submitError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionsByGradeAndChapter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionsByGradeAndChapter.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestionsByGradeAndChapter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchChaptersByGrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChaptersByGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.chapters = action.payload;
      })
      .addCase(fetchChaptersByGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add cases for fetchLesson
      .addCase(fetchLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.lesson = action.payload;
      })
      .addCase(fetchLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add cases for fetchTest
      .addCase(fetchTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTest.fulfilled, (state, action) => {
        state.loading = false;
        state.test = action.payload;
      })
      .addCase(fetchTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('error', action.payload);
      })
      // Add cases for sendAnswer
      .addCase(sendAnswer.pending, (state) => {
        state.submittingAnswer = true;
        state.submitError = null;
      })
      .addCase(sendAnswer.fulfilled, (state, action) => {
        state.submittingAnswer = false;
      })
      .addCase(sendAnswer.rejected, (state, action) => {
        state.submittingAnswer = false;
        state.submitError = action.payload;
      });
  },
});

export default questionSlice.reducer;
