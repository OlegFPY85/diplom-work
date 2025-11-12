import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storageAPI } from '../../services/api';

export const fetchFiles = createAsyncThunk(
  'storage/fetchFiles',
  async (userId = null, { rejectWithValue }) => {
    try {
      const response = await storageAPI.getFiles(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка загрузки файлов');
    }
  }
);

export const uploadFile = createAsyncThunk(
  'storage/uploadFile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await storageAPI.uploadFile(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка загрузки файла');
    }
  }
);

export const deleteFile = createAsyncThunk(
  'storage/deleteFile',
  async (fileId, { rejectWithValue }) => {
    try {
      await storageAPI.deleteFile(fileId);
      return fileId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка удаления файла');
    }
  }
);

export const updateFile = createAsyncThunk(
  'storage/updateFile',
  async ({ fileId, data }, { rejectWithValue }) => {
    try {
      const response = await storageAPI.updateFile(fileId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка обновления файла');
    }
  }
);

export const downloadFile = createAsyncThunk(
  'storage/downloadFile',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await storageAPI.downloadFile(fileId);
      
      // Создаем временную ссылку для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Получаем имя файла из заголовков
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'file';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return fileId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка скачивания файла');
    }
  }
);

export const getPublicLink = createAsyncThunk(
  'storage/getPublicLink',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await storageAPI.getPublicLink(fileId);
      return { fileId, publicUrl: response.data.public_url };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка создания публичной ссылки');
    }
  }
);

const storageSlice = createSlice({
  name: 'storage',
  initialState: {
    files: [],
    loading: false,
    error: null,
    uploadProgress: 0,
    currentFolder: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearUploadProgress: (state) => {
      state.uploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Files
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload File
      .addCase(uploadFile.pending, (state) => {
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploadProgress = 100;
        state.files.unshift(action.payload);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploadProgress = 0;
        state.error = action.payload;
      })
      // Delete File
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(file => file.id !== action.payload);
      })
      // Update File
      .addCase(updateFile.fulfilled, (state, action) => {
        const index = state.files.findIndex(file => file.id === action.payload.id);
        if (index !== -1) {
          state.files[index] = action.payload;
        }
      });
  },
});

export const { clearError, setUploadProgress, clearUploadProgress } = storageSlice.actions;
export default storageSlice.reducer;