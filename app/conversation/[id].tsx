import React, { useState, useRef } from 'react';
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
  InputAccessoryView,
  Keyboard,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// @ts-ignore
import { Feather } from '@expo/vector-icons';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../hooks/useTheme';
import { MarkdownView } from '../../components/MarkdownView';

export default function ConversationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { conversations, updateConversation, deleteConversation } = useData();

  const conversation = conversations.find((c) => c.id === id);

  const [editingField, setEditingField] = useState<'question' | 'answer' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleEditField = (field: 'question' | 'answer') => {
    if (!conversation) return;
    setEditValue(field === 'question' ? conversation.question : conversation.answer);
    setIsTyping(false);
    setEditingField(field);
  };

  const handleCloseModal = () => {
    setIsTyping(false);
    setEditingField(null);
  };

  const handleTapText = () => {
    setIsTyping(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleDone = () => {
    Keyboard.dismiss();
    setIsTyping(false);
  };

  const handleSaveEdit = async () => {
    if (!conversation || !editValue.trim() || !editingField) return;
    const newQuestion = editingField === 'question' ? editValue.trim() : conversation.question;
    const newAnswer = editingField === 'answer' ? editValue.trim() : conversation.answer;
    await updateConversation(conversation.id, newQuestion, newAnswer);
    setEditingField(null);
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
            <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
              <Feather name="trash-2" size={20} color={colors.danger} />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={[styles.labelContainer, { backgroundColor: colors.primary }]}>
              <Text style={styles.label}>質問</Text>
              <TouchableOpacity onPress={() => handleEditField('question')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Feather name="edit-2" size={14} color="#FFFFFF" />
              </TouchableOpacity>
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
              <TouchableOpacity onPress={() => handleEditField('answer')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Feather name="edit-2" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.markdownContainer}>
              <MarkdownView content={conversation.answer} />
            </View>
          </View>
        </ScrollView>

        <Modal visible={editingField !== null} animationType="slide">
          <View style={[styles.modalContainer, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContent}
            >
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCloseModal}>
                  <Text style={{ color: colors.primary, fontSize: 16 }}>キャンセル</Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {editingField === 'question' ? '質問を編集' : '回答を編集'}
                </Text>
                <TouchableOpacity onPress={handleSaveEdit} disabled={!editValue.trim()}>
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: 16,
                      fontWeight: '600',
                      opacity: editValue.trim() ? 1 : 0.5,
                    }}
                  >
                    保存
                  </Text>
                </TouchableOpacity>
              </View>

              {isTyping ? (
                <TextInput
                  ref={inputRef}
                  style={[styles.editInput, { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7', color: colors.text }]}
                  value={editValue}
                  onChangeText={setEditValue}
                  placeholder={editingField === 'question' ? '質問を入力' : 'AIの回答を貼り付け'}
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  textAlignVertical="top"
                  inputAccessoryViewID="editAccessory"
                />
              ) : (
                <ScrollView style={styles.editInput} contentContainerStyle={{ padding: 0 }}>
                  <TouchableOpacity onPress={handleTapText} activeOpacity={1}>
                    <Text style={{ color: editValue ? colors.text : colors.textSecondary, fontSize: 16, lineHeight: 24 }}>
                      {editValue || (editingField === 'question' ? '質問を入力' : 'AIの回答を貼り付け')}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </SafeAreaView>
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID="editAccessory">
          <View style={[styles.accessoryBar, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7', borderTopColor: colors.border }]}>
            <TouchableOpacity onPress={handleDone} style={styles.accessoryButton}>
              <Text style={{ color: colors.primary, fontSize: 16 }}>完了</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  editInput: {
    flex: 1,
    margin: 16,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  accessoryBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  accessoryButton: {
    paddingHorizontal: 8,
  },
});
