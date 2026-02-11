import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore
import { Feather } from '@expo/vector-icons';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../hooks/useTheme';
import { MarkdownView } from '../../components/MarkdownView';

export default function ConversationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { conversations, updateConversation, deleteConversation } = useData();

  const conversation = conversations.find((c) => c.id === id);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  const handleEdit = () => {
    if (!conversation) return;
    setEditQuestion(conversation.question);
    setEditAnswer(conversation.answer);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!conversation || !editQuestion.trim() || !editAnswer.trim()) return;
    await updateConversation(conversation.id, editQuestion.trim(), editAnswer.trim());
    setEditModalVisible(false);
  };

  const handleDelete = () => {
    if (!conversation) return;
    Alert.alert('会話を削除', 'この会話を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          await deleteConversation(conversation.id);
          router.back();
        },
      },
    ]);
  };

  if (!conversation) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>会話が見つかりません</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '会話詳細',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
                <Feather name="edit-2" size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
                <Feather name="trash-2" size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={[styles.labelContainer, { backgroundColor: colors.primary }]}>
              <Text style={styles.label}>質問</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.questionText, { color: colors.text }]}>
                {conversation.question}
              </Text>
            </View>
          </View>

          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={[styles.labelContainer, { backgroundColor: colors.success }]}>
              <Text style={styles.label}>回答</Text>
            </View>
            <View style={styles.markdownContainer}>
              <MarkdownView content={conversation.answer} />
            </View>
          </View>
        </ScrollView>

        <Modal visible={editModalVisible} animationType="slide">
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContent}
            >
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <Text style={{ color: colors.primary, fontSize: 16 }}>キャンセル</Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: colors.text }]}>編集</Text>
                <TouchableOpacity
                  onPress={handleSaveEdit}
                  disabled={!editQuestion.trim() || !editAnswer.trim()}
                >
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: 16,
                      fontWeight: '600',
                      opacity: editQuestion.trim() && editAnswer.trim() ? 1 : 0.5,
                    }}
                  >
                    保存
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalForm}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>質問</Text>
                <TextInput
                  style={[
                    styles.textArea,
                    {
                      backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7',
                      color: colors.text,
                    },
                  ]}
                  value={editQuestion}
                  onChangeText={setEditQuestion}
                  placeholder="質問を入力"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  textAlignVertical="top"
                />

                <Text style={[styles.inputLabel, { color: colors.text }]}>回答</Text>
                <TextInput
                  style={[
                    styles.textArea,
                    styles.answerInput,
                    {
                      backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7',
                      color: colors.text,
                    },
                  ]}
                  value={editAnswer}
                  onChangeText={setEditAnswer}
                  placeholder="AIの回答を貼り付け"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  textAlignVertical="top"
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  labelContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  textContainer: {
    padding: 16,
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  markdownContainer: {
    padding: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    paddingVertical: 4,
  },
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C6C8',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  modalForm: {
    flex: 1,
    padding: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  textArea: {
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 20,
  },
  answerInput: {
    minHeight: 200,
  },
});
