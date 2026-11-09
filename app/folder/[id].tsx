import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore
import { Feather } from '@expo/vector-icons';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../hooks/useTheme';
import { AnswerRow } from '../../components/AnswerRow';
import { FolderNameModal } from '../../components/FolderNameModal';
import { Conversation } from '../../types';

export default function FolderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { folders, conversations, updateFolder, deleteFolder, deleteConversation } = useData();
  const [renaming, setRenaming] = useState(false);

  const isAll = id === 'all';
  const folder = folders.find((f) => f.id === id);
  const list = conversations
    .filter((c) => isAll || c.folderId === id)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const folderNameOf = (folderId: string) => folders.find((f) => f.id === folderId)?.name;

  const handleNew = () => {
    router.push({ pathname: '/conversation/new', params: folder ? { folderId: folder.id } : {} });
  };

  const handleLongPress = (conversation: Conversation) => {
    Alert.alert('この回答を削除しますか？', '', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '削除', style: 'destructive', onPress: () => deleteConversation(conversation.id) },
    ]);
  };

  const handleDeleteFolder = () => {
    if (!folder) return;
    Alert.alert(
      'フォルダを削除',
      `「${folder.name}」を削除しますか？${list.length > 0 ? `\n${list.length}件の回答も削除されます。` : ''}`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            await deleteFolder(folder.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleMenu = () => {
    if (!folder) return;
    Alert.alert(folder.name, '', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '名前を変更', onPress: () => setRenaming(true) },
      { text: '削除', style: 'destructive', onPress: handleDeleteFolder },
    ]);
  };

  if (!isAll && !folder) {
    return <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: isAll ? 'すべての回答' : folder?.name,
          headerRight: () => (
            <View style={styles.headerRight}>
              {folder && (
                <TouchableOpacity onPress={handleMenu} accessibilityLabel="フォルダの操作" hitSlop={8}>
                  <Feather name="more-horizontal" size={22} color={colors.primary} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleNew} accessibilityLabel="回答を保存" hitSlop={8}>
                <Feather name="plus" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        {list.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>回答がありません</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              右上の＋から、残したいAIの回答を保存できます
            </Text>
          </View>
        ) : (
          <FlatList
            data={list}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <AnswerRow
                conversation={item}
                folderName={isAll ? folderNameOf(item.folderId) : undefined}
                isFirst={index === 0}
                isLast={index === list.length - 1}
                onPress={() => router.push(`/conversation/${item.id}`)}
                onLongPress={() => handleLongPress(item)}
              />
            )}
            contentContainerStyle={styles.list}
          />
        )}
      </SafeAreaView>
      {folder && (
        <FolderNameModal
          visible={renaming}
          title="フォルダ名を変更"
          submitLabel="変更"
          initialName={folder.name}
          onCancel={() => setRenaming(false)}
          onSubmit={async (name) => {
            await updateFolder(folder.id, name);
            setRenaming(false);
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
});
