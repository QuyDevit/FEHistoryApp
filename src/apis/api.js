import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const getBaseUrl = () => API_URL;
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    config.baseURL = getBaseUrl();
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request Config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor với xử lý token hết hạn
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', response.data);
    
    // Nếu response chứa token mới, cập nhật vào AsyncStorage
    if (response.data?.token) {
      AsyncStorage.setItem('userToken', response.data.token);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu lỗi 401 (Unauthorized) và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Thực hiện login lại để lấy token mới
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        
        if (username && password) {
          const response = await api.login(username, password);
          const newToken = response.data.token;
          
          // Lưu token mới
          await AsyncStorage.setItem('userToken', newToken);
          
          // Cập nhật token trong header của request gốc
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Thử lại request gốc với token mới
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const api = {
  login: (username, password) => apiClient.post('/api/auth/checklogin', { username, password }),
  register: (userData) => apiClient.post('/api/auth/register', userData),
  updateInfo: (userData) => apiClient.post('/api/auth/updateinfo', userData),
  getInfoUser: () => apiClient.post('/api/auth/GetInfoByUser'),

  getListQuestionByGradeAndChapter: (gradeId, chapterId) => apiClient.post('/api/home/getListQuestionByGradeAndChapter', { gradeId, chapterId }),
  getListChapter: (gradeId) => apiClient.post('/api/home/getListChapter', { gradeId }),
  
  getLesson: (chapterId) => apiClient.post('/api/home/getLesson', { chapterId }),
  getTest: (gradeId) => apiClient.post('/api/home/GetTest', { gradeId }),
  getTestById: (testId) => apiClient.post('/api/home/GetTestById', { testId }),
  sendAnswer: (testId, questionId, answerId) => apiClient.post('/api/home/SendAnswer', { testId, questionId, answerId }),
  
  getListResult: () => apiClient.post('/api/home/GetListResult'),
  
  getDetailResult: (testId) => apiClient.post('/api/home/DetailResult', { testId }),

  saveInfoUser: (userData) => apiClient.post('/api/auth/SaveInfoUser', userData),
};