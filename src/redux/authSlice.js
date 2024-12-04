import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../apis/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = createAsyncThunk(
  'auth/login',
  async ({ emailOrUsername, password }, { rejectWithValue }) => {
    try {
      const response = await api.login(emailOrUsername, password);
      if (response.data.status) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('username', emailOrUsername);
        await AsyncStorage.setItem('password', password);
        
        const expiryTime = new Date().getTime() + (60 * 60 * 1000);
        await AsyncStorage.setItem('tokenExpiry', expiryTime.toString());
        
        return response.data;
      } else {
        return rejectWithValue(response.data.msg);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Có lỗi xảy ra');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.register(userData);
      if (response.data.status) {
        return response.data;
      } else {
        return rejectWithValue(response.data.msg || 'Đăng ký không thành công');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Có lỗi xảy ra');
    }
  }
);

export const updateInfo = createAsyncThunk(
  'auth/updateInfo',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.updateInfo(userData);
      
      if (response.data.status === true) {
        return userData;
      } else {
        return rejectWithValue(response.data.msg || 'Cập nhật không thành công');
      }
    } catch (error) {
      console.error('Update error:', error);
      return rejectWithValue(error.response?.data?.msg || 'Có lỗi xảy ra');
    }
  }
);

export const getInfoUser = createAsyncThunk(
  'auth/getInfoUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getInfoUser();
      if (response.data.status) {
        return response.data.data;
      } else {
        return rejectWithValue('Không thể lấy thông tin người dùng');
      }
    } catch (error) {
      console.error('GetInfoUser error:', error);
      return rejectWithValue(error.response?.data?.msg || 'Có lỗi xảy ra');
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const tokenExpiry = await AsyncStorage.getItem('tokenExpiry');
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      if (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        
        if (username && password) {
          return dispatch(login({ emailOrUsername: username, password })).unwrap();
        }
      }
      
      return { status: true, token };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await AsyncStorage.multiRemove([
      'userToken',
      'username',
      'password',
      'tokenExpiry'
    ]);
  }
);

export const saveUserInfo = createAsyncThunk(
  'auth/saveUserInfo',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.saveInfoUser(userData);
      if (response.data.status) {
        return userData; // Return the updated user data
      } else {
        return rejectWithValue('Cập nhật thông tin không thành công');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Có lỗi xảy ra');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: 'idle',
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.payload;
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.payload;
      })
      // Update info cases
      .addCase(updateInfo.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(updateInfo.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateInfo.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.payload;
      })
      // Get user info cases
      .addCase(getInfoUser.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(getInfoUser.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.user = action.payload;
      })
      .addCase(getInfoUser.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.payload;
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.user = action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = 'idle';
        state.user = null;
      })
      .addCase(saveUserInfo.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(saveUserInfo.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.user = { ...state.user, ...action.payload }; // Update user info
        state.error = null;
      })
      .addCase(saveUserInfo.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = action.payload;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;