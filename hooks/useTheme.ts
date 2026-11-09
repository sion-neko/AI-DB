import { useColorScheme } from 'react-native';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    isDark,
    colors: {
      background: isDark ? '#0E0D0E' : '#F2F0F1',
      surface: isDark ? '#1F1C1E' : '#FFFFFF',
      fieldBackground: isDark ? '#2B272A' : '#E8E4E6',
      text: isDark ? '#F6F2F3' : '#1C191E',
      textSecondary: isDark ? '#AFA5AB' : '#6F656C',
      border: isDark ? '#332E31' : '#E6E1E3',
      primary: isDark ? '#F79AAE' : '#BE2F57',
      onPrimary: isDark ? '#3A1220' : '#FFFFFF',
      codeText: isDark ? '#F79AAE' : '#BE2F57',
      danger: isDark ? '#FF7A70' : '#D92D20',
    },
  };
};
