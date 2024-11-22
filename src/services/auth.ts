import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, LoginCredentials } from '../types/auth';

const AUTH_STORAGE_KEY = '@auth_data';

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post('https://app.intedigital.com/auth', credentials);
    const authData = response.data;
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    return authData;
  } catch (error) {
    throw new Error('Authentication failed');
  }
};

export const getStoredAuth = async () => {
  const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  return authData ? JSON.parse(authData) : null;
};

export const clearAuth = async () => {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
};