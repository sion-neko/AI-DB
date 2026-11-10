import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, title: 'あいろく' }} />
        <Stack.Screen name="folder/[id]" options={{ title: '' }} />
        <Stack.Screen
          name="conversation/[id]"
          options={{ title: '', headerStyle: { backgroundColor: colors.surface } }}
        />
        <Stack.Screen name="search" options={{ title: '検索' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DataProvider>
        <RootLayoutNav />
      </DataProvider>
    </GestureHandlerRootView>
  );
}
