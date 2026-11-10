import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../hooks/useTheme';
import { SearchBar } from '../components/SearchBar';
import { AnswerRow } from '../components/AnswerRow';
import { Conversation } from '../types';
import { easeListChange } from '../utils/motion';

export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { searchConversations, folders, deleteConversation } = useData();

  const [query, setQuery] = useState('');

  const results = query.trim() ? searchConversations(query) : [];

  const getFolderName = (folderId: string) => folders.find((f) => f.id === folderId)?.name;

  const handleDeleteConversation = (conversation: Conversation, close: () => void) => {
    Alert.alert('この回答を削除しますか？', '', [
      { text: 'キャンセル', style: 'cancel', onPress: close },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => {
          easeListChange();
          deleteConversation(conversation.id);
        },
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
            質問や回答の言葉で探せます
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            「{query}」を含む回答はありません
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <AnswerRow
              conversation={item}
              folderName={getFolderName(item.folderId)}
              isFirst={index === 0}
              isLast={index === results.length - 1}
              onPress={() => router.push(`/conversation/${item.id}`)}
              onDelete={(close) => handleDeleteConversation(item, close)}
            />
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
});
