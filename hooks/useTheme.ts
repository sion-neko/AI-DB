import { useColorScheme } from 'react-native';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    isDark,
    colors: {
      background: isDark ? '#000000' : '#F2F2F7',
      surface: isDark ? '#1C1C1E' : '#FFFFFF',
      text: isDark ? '#FFFFFF' : '#000000',
      textSecondary: isDark ? '#8E8E93' : '#6C6C70',
      border: isDark ? '#38383A' : '#C6C6C8',
      primary: '#007AFF',
      danger: '#FF3B30',
      success: '#34C759',
    },
  };
};
