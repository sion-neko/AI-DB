import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Alert,
  TextInput,
  Keyboard,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
// @ts-ignore
import { Feather } from '@expo/vector-icons';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../hooks/useTheme';
import { MarkdownView } from '../../components/MarkdownView';
import { NoteFields, noteStyles } from '../../components/NoteFields';

export default function ConversationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { conversations, updateConversation, deleteConversation } = useData();
  const conversation = conversations.find((c) => c.id === id);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(conversation?.question ?? '');
  const [body, setBody] = useState(conversation?.answer ?? '');
  const [bodySelection, setBodySelection] = useState<{ start: number; end: number }>();
  const [copied, setCopied] = useState(false);

  const titleRef = useRef<TextInput>(null);
  const bodyRef = useRef<TextInput>(null);
  const bodyContentRef = useRef<View>(null);
  const bodyHeight = useRef(1);
  const deleted = useRef(false);

  // 自動保存はタイマーや画面を閉じた後にも走るので、最新の値を参照する
  const latest = useRef({ title, body, conversation, updateConversation });
  latest.current = { title, body, conversation, updateConversation };

  const commit = () => {
    const current = latest.current;
    if (!current.conversation || deleted.current) return;
    const nextTitle = current.title.trim();
    const nextBody = current.body.trim();
    if (!nextTitle && !nextBody) return;
    if (nextTitle === current.conversation.question && nextBody === current.conversation.answer) return;
    current.updateConversation(current.conversation.id, nextTitle, nextBody);
  };

  const finishEditing = () => {
    commit();
    const current = latest.current;
    if (current.conversation) {
      // 題も本文も空にしたまま閉じたときは元に戻す
      if (!current.title.trim() && !current.body.trim()) {
        setTitle(current.conversation.question);
        setBody(current.conversation.answer);
      }
    }
    setBodySelection(undefined);
    setEditing(false);
  };

  useEffect(() => {
    if (!editing) return;
    const timer = setTimeout(commit, 500);
    return () => clearTimeout(timer);
  }, [editing, title, body]);

  useEffect(() => () => commit(), []);

  // データの読み込みが後から終わった場合や、読む表示のときは保存済みの内容に合わせる
  useEffect(() => {
    if (editing || !conversation) return;
    setTitle(conversation.question);
    setBody(conversation.answer);
  }, [editing, conversation?.question, conversation?.answer]);

  const startEditing = (field: 'title' | 'body', selection?: { start: number; end: number }) => {
    setBodySelection(selection);
    setEditing(true);
    setTimeout(() => {
      (field === 'title' ? titleRef : bodyRef).current?.focus();
      setTimeout(() => setBodySelection(undefined), 100);
    }, 50);
  };

  // 押した文字の位置は分からないので、本文の高さに対する割合からカーソル位置を見積もる
  const handleBodyPress = (pageY: number) => {
    bodyContentRef.current?.measureInWindow((_x, top) => {
      const ratio = Math.min(Math.max((pageY - top) / bodyHeight.current, 0), 1);
      const position = Math.round(body.length * ratio);
      startEditing('body', { start: position, end: position });
    });
  };

  const handleDelete = () => {
    if (!conversation) return;
    Alert.alert('回答を削除', 'この回答を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          deleted.current = true;
          await deleteConversation(conversation.id);
          router.back();
        },
      },
    ]);
  };

  const handleCopy = async () => {
    if (!conversation) return;
    await Clipboard.setStringAsync(conversation.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!conversation) {
    return <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} />;
  }

  const date = new Date(conversation.updatedAt);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () =>
            editing ? (
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  finishEditing();
                }}
                hitSlop={8}
                accessibilityLabel="完了"
              >
                <Feather name="check" size={25} color={colors.primary} />
              </TouchableOpacity>
            ) : null,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          {editing ? (
            <NoteFields
              title={title}
              body={body}
              onChangeTitle={setTitle}
              onChangeBody={setBody}
              titleRef={titleRef}
              bodyRef={bodyRef}
              bodySelection={bodySelection}
            />
          ) : (
            <>
              <Pressable onPress={() => startEditing('title')} testID="title">
                <Text style={[noteStyles.title, { color: conversation.question ? colors.text : colors.textSecondary }]}>
                  {conversation.question || '題'}
                </Text>
              </Pressable>
              <Text style={[styles.date, { color: colors.textSecondary }]}>
                {date.getMonth() + 1}月{date.getDate()}日
              </Text>
              <View style={[noteStyles.rule, { backgroundColor: colors.border }]} />
              <Pressable style={styles.bodyArea} onPress={(e) => handleBodyPress(e.nativeEvent.pageY)} testID="body">
                <View
                  ref={bodyContentRef}
                  collapsable={false}
                  onLayout={(e) => {
                    bodyHeight.current = e.nativeEvent.layout.height || 1;
                  }}
                >
                  <MarkdownView content={conversation.answer} />
                </View>
              </Pressable>
            </>
          )}
        </ScrollView>

        {!editing && (
          <View style={[styles.toolbar, { borderTopColor: colors.border }]}>
            <TouchableOpacity onPress={handleDelete} hitSlop={10} accessibilityLabel="この回答を削除">
              <Feather name="trash-2" size={21} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.copy} onPress={handleCopy} hitSlop={10}>
              <Feather name={copied ? 'check' : 'copy'} size={20} color={colors.primary} />
              <Text style={[styles.copyText, { color: colors.primary }]}>
                {copied ? 'コピーしました' : '回答をコピー'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 40,
  },
  bodyArea: {
    flex: 1,
    minHeight: 240,
  },
  date: {
    fontSize: 13,
    marginTop: 8,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  copy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  copyText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
