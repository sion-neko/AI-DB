import React, { useRef, useState } from 'react';
import { Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../hooks/useTheme';
import { NoteFields } from '../../components/NoteFields';

export default function NewConversationScreen() {
  const { folderId } = useLocalSearchParams<{ folderId?: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { addConversation } = useData();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const titleRef = useRef<TextInput>(null);
  const bodyRef = useRef<TextInput>(null);

  const canSave = !!title.trim() && !!body.trim();

  const handleCancel = () => {
    if (!title.trim() && !body.trim()) {
      router.back();
      return;
    }
    Alert.alert('入力内容を破棄しますか？', '', [
      { text: '続ける', style: 'cancel' },
      { text: '破棄', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  const handleDone = async () => {
    if (!canSave) return;
    const created = await addConversation(folderId ?? '', title.trim(), body.trim());
    router.replace(`/conversation/${created.id}`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} hitSlop={8}>
              <Text style={[styles.navText, { color: colors.primary }]}>キャンセル</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleDone} disabled={!canSave} hitSlop={8}>
              <Text style={[styles.navText, styles.done, { color: colors.primary, opacity: canSave ? 1 : 0.45 }]}>
                完了
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <NoteFields
            title={title}
            body={body}
            onChangeTitle={setTitle}
            onChangeBody={setBody}
            titleRef={titleRef}
            bodyRef={bodyRef}
            autoFocusTitle
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 40,
  },
  navText: {
    fontSize: 17,
  },
  done: {
    fontWeight: '700',
  },
});
