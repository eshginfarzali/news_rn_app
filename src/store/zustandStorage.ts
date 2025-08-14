import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PersistStorage, StorageValue } from 'zustand/middleware';

export const zustandStorage: PersistStorage<any> = {
  getItem: async (name: string): Promise<StorageValue<any> | null> => {
    const value = await AsyncStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name: string, value: StorageValue<any>): Promise<void> => {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(name);
  },
};
