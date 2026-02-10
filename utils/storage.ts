import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, Folder, Conversation } from '../types';

const STORAGE_KEY = 'ai_conversation_saver_data';

const getDefaultData = (): AppData => ({
  folders: [],
  conversations: [],
});

export const loadData = async (): Promise<AppData> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      return JSON.parse(json);
    }
    return getDefaultData();
  } catch (error) {
    console.error('Failed to load data:', error);
    return getDefaultData();
  }
};

export const saveData = async (data: AppData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
