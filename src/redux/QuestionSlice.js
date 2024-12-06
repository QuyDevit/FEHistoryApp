import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../apis/api';

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
export const fetchTestById = createAsyncThunk(
  'questions/fetchTestById',
  async (testId, thunkAPI) => {
    try {
      const response = await api.getTestById(testId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const sendAnswer = createAsyncThunk(
  'questions/sendAnswer',
  async ({ testId, questionId, answerId }, thunkAPI) => {
    
    try {
      const response = await api.sendAnswer(testId, questionId, answerId);
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchListResult = createAsyncThunk(
  'questions/fetchListResult',
  async (_, thunkAPI) => {
    try {
      const response = await api.getListResult();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchDetailResult = createAsyncThunk(
  'questions/fetchDetailResult',
  async (testId, thunkAPI) => {
    try {
      const response = await api.getDetailResult(testId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchListHisFigure = createAsyncThunk(
  'questions/fetchListHisFigure',
  async (_, thunkAPI) => {
    try {
      const response = await api.getListHisFigure();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchHistoricalFigureById = createAsyncThunk(
  'questions/fetchHistoricalFigureById',
  async (id, thunkAPI) => {
    try {
      const response = await api.getHistoricalFigureById(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching historical figure:', error);
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
    testById: null,
    testResults: [],
    loading: false,
    loadingResults: false,
    error: null,
    resultError: null,
    submittingAnswer: false,
    submitError: null,
    historicalFigures: [],
    historicalFigure: null,
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
      })
      // Add cases for fetchListResult
      .addCase(fetchListResult.pending, (state) => {
        state.loadingResults = true;
        state.resultError = null;
      })
      .addCase(fetchListResult.fulfilled, (state, action) => {
        state.loadingResults = false;
        state.testResults = action.payload;
      })
      .addCase(fetchListResult.rejected, (state, action) => {
        state.loadingResults = false;
        state.resultError = action.payload;
      })
      
      // Add cases for fetchDetailResult
      .addCase(fetchDetailResult.pending, (state) => {
        state.loadingResults = true;
        state.resultError = null;
      })
      .addCase(fetchDetailResult.fulfilled, (state, action) => {
        state.loadingResults = false;
        state.testDetail = action.payload;
      })
      .addCase(fetchDetailResult.rejected, (state, action) => {
        state.loadingResults = false;
        state.resultError = action.payload;
      })
      // Add cases for fetchTestById
      .addCase(fetchTestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestById.fulfilled, (state, action) => {
        state.loading = false;
        state.testById = action.payload;
      })
      .addCase(fetchTestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add cases for fetchListHisFigure
      .addCase(fetchListHisFigure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListHisFigure.fulfilled, (state, action) => {
        state.loading = false;
        state.historicalFigures = action.payload;
      })
      .addCase(fetchListHisFigure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchHistoricalFigureById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistoricalFigureById.fulfilled, (state, action) => {
        console.log('Fetched Historical Figure:', action.payload);
        state.loading = false;
        state.historicalFigure = action.payload;
      })
      .addCase(fetchHistoricalFigureById.rejected, (state, action) => {
        console.error('Error fetching historical figure:', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default questionSlice.reducer;
