import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { AuthResponse, LoginCredentials } from '../types';

const AUTH_KEY = 'auth_data';

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post('https://app.intedigital.com/auth/index.php', credentials);
    const authData = response.data;
    
    if (!authData.endpoint || !authData.consumerKey || !authData.secretKey) {
      throw new Error('Invalid authentication response');
    }
    
    await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(authData));
    return authData;
  } catch (error) {
    console.error('Auth Error:', error);
    throw new Error('Authentication failed');
  }
};

export const getStoredAuth = async (): Promise<AuthResponse | null> => {
  try {
    const authData = await SecureStore.getItemAsync(AUTH_KEY);
    return authData ? JSON.parse(authData) : null;
  } catch (error) {
    console.error('Storage Error:', error);
    return null;
  }
};

export const clearAuth = async () => {
  try {
    await SecureStore.deleteItemAsync(AUTH_KEY);
  } catch (error) {
    console.error('Clear Auth Error:', error);
  }
};