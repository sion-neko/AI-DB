import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../hooks/useTheme';
import { ConversationCard } from '../../components/ConversationCard';
import { Conversation } from '../../types';

export default function FolderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { folders, getConversationsByFolder, deleteConversation } = useData();

  const folder = folders.find((f) => f.id === id);
  const conversations = id ? getConversationsByFolder(id) : [];

  const handleDeleteConversation = (conversation: Conversation) => {
    Alert.alert('会話を削除', 'この会話を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => deleteConversation(conversation.id),
      },
    ]);
  };

  const handleConversationLongPress = (conversation: Conversation) => {
    Alert.alert('操作を選択', '', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => handleDeleteConversation(conversation),
      },
    ]);
  };

  if (!folder) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>フォルダが見つかりません</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: folder.name }} />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        {conversations.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              会話がありません
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              右下の＋ボタンで会話を追加してください
            </Text>
          </View>
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ConversationCard
                conversation={item}
                onPress={() => router.push(`/conversation/${item.id}`)}
                onLongPress={() => handleConversationLongPress(item)}
              />
            )}
            contentContainerStyle={styles.list}
          />
        )}

        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => router.push({ pathname: '/conversation/new', params: { folderId: id } })}
        >
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingVertical: 8,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});
