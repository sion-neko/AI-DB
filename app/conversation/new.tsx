import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, TextInput, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore
import { Feather } from '@expo/vector-icons';
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
  const saved = useRef(false);

  // 戻るだけでも保存する。何も書いていなければ作らない
  const latest = useRef({ title, body, addConversation });
  latest.current = { title, body, addConversation };

  const save = async () => {
    const current = latest.current;
    const nextTitle = current.title.trim();
    const nextBody = current.body.trim();
    if (saved.current || (!nextTitle && !nextBody)) return null;
    saved.current = true;
    return current.addConversation(folderId ?? '', nextTitle, nextBody);
  };

  useEffect(
    () => () => {
      save();
    },
    []
  );

  const handleDone = async () => {
    Keyboard.dismiss();
    const created = await save();
    if (created) {
      router.replace(`/conversation/${created.id}`);
    } else {
      router.back();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={handleDone} hitSlop={8} accessibilityLabel="完了">
              <Feather name="check" size={25} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardDismissMode="none"
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
});
