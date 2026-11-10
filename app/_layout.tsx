import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataProvider, useData } from '../contexts/DataContext';
import { useTheme } from '../hooks/useTheme';

// 保存データを読み終えるまで起動画面を出したままにし、読めたらふわっと消す。
// 先に消すと、空の画面が一瞬見えてから中身が出る
SplashScreen.preventAutoHideAsync().catch(() => {});
try {
  SplashScreen.setOptions({ fade: true, duration: 350 });
} catch {
  // Expo Go では設定できないことがある。そのときは既定の消え方のままでよい
}

function RootLayoutNav() {
  const { colors, isDark } = useTheme();
  const { isLoading } = useData();

  useEffect(() => {
    if (!isLoading) SplashScreen.hideAsync().catch(() => {});
  }, [isLoading]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text },
          headerShadowVisible: false,
          // 戻るボタンは「<」だけにする（前の画面の名前は出さない）
          headerBackButtonDisplayMode: 'minimal',
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
