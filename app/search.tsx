import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../hooks/useTheme';
import { SearchBar } from '../components/SearchBar';
import { ConversationCard } from '../components/ConversationCard';
import { Conversation } from '../types';

export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { searchConversations, folders, deleteConversation } = useData();

  const [query, setQuery] = useState('');

  const results = query.trim() ? searchConversations(query) : [];

  const getFolderName = (folderId: string): string => {
    const folder = folders.find((f) => f.id === folderId);
    return folder?.name || '不明';
  };

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="質問または回答を検索"
      />

      {query.trim() === '' ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            検索キーワードを入力してください
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            「{query}」に一致する会話はありません
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <Text style={[styles.folderLabel, { color: colors.textSecondary }]}>
                📁 {getFolderName(item.folderId)}
              </Text>
              <ConversationCard
                conversation={item}
                onPress={() => router.push(`/conversation/${item.id}`)}
                onLongPress={() => handleDeleteConversation(item)}
              />
            </View>
          )}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
              {results.length}件の結果
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingBottom: 20,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  resultCount: {
    fontSize: 14,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  folderLabel: {
    fontSize: 12,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
