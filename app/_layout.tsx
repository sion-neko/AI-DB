import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DataProvider } from '../contexts/DataContext';
import { useTheme } from '../hooks/useTheme';

function RootLayoutNav() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: 'AI会話保存' }}
        />
        <Stack.Screen
          name="folder/[id]"
          options={{ title: 'フォルダ' }}
        />
        <Stack.Screen
          name="conversation/[id]"
          options={{ title: '会話詳細' }}
        />
        <Stack.Screen
          name="conversation/new"
          options={{ title: '新規会話', presentation: 'modal' }}
        />
        <Stack.Screen
          name="search"
          options={{ title: '検索' }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <DataProvider>
      <RootLayoutNav />
    </DataProvider>
  );
}
