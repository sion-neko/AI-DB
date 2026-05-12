import React, { useState } from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../hooks/useTheme';

export default function NewConversationScreen() {
  const { folderId } = useLocalSearchParams<{ folderId: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { addConversation } = useData();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSave = async () => {
    if (!question.trim()) {
      Alert.alert('エラー', '質問を入力してください');
      return;
    }
    if (!answer.trim()) {
      Alert.alert('エラー', '回答を入力してください');
      return;
    }

    await addConversation(folderId, question.trim(), answer.trim());
    router.back();
  };

  const canSave = question.trim() && answer.trim();

  return (
    <>
      <Stack.Screen
        options={{
          title: '新規会話',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ color: colors.primary, fontSize: 16 }}>キャンセル</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} disabled={!canSave}>
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 16,
                  fontWeight: '600',
                  opacity: canSave ? 1 : 0.5,
                }}
              >
                保存
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <ScrollView style={styles.form}>
            <Text style={[styles.label, { color: colors.text }]}>質問</Text>
            <TextInput
              style={[
                styles.textArea,
                { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7', color: colors.text },
              ]}
              value={question}
              onChangeText={setQuestion}
              placeholder="質問を入力"
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
            />

            <Text style={[styles.label, { color: colors.text }]}>回答</Text>
            <TextInput
              style={[
                styles.textArea,
                styles.answerInput,
                { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7', color: colors.text },
              ]}
              value={answer}
              onChangeText={setAnswer}
              placeholder="AIの回答を貼り付け（Markdown対応）"
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  form: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  textArea: {
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  answerInput: {
    minHeight: 200,
    marginBottom: 40,
  },
});
