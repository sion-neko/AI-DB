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
      primary: isDark ? '#8AE3B9' : '#197A57',
      onPrimary: isDark ? '#0B2B20' : '#FFFFFF',
      accent: '#FFD45E',
      onAccent: '#24243F',
      danger: '#FF3B30',
    },
  };
};
