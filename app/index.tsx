import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore
import { Feather } from '@expo/vector-icons';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../hooks/useTheme';
import { FolderNameModal } from '../components/FolderNameModal';
import { SwipeToDelete } from '../components/SwipeToDelete';
import { Folder } from '../types';
import { easeListChange, MODAL_SETTLE_MS } from '../utils/motion';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { folders, conversations, addFolder, deleteFolder, isLoading } = useData();

  const [modalVisible, setModalVisible] = useState(false);

  const countOf = (folderId: string) => conversations.filter((c) => c.folderId === folderId).length;
  const sortedFolders = [...folders].sort((a, b) => b.createdAt - a.createdAt);

  const handleSubmit = (name: string) => {
    setModalVisible(false);
    // 入力欄が閉じきってから、一覧に行を足す
    setTimeout(() => {
      easeListChange();
      addFolder(name);
    }, MODAL_SETTLE_MS);
  };

  const handleDelete = (folder: Folder, close?: () => void) => {
    const count = countOf(folder.id);
    Alert.alert(
      'フォルダを削除',
      `「${folder.name}」を削除しますか？${count > 0 ? `\n${count}件の回答も削除されます。` : ''}`,
      [
        { text: 'キャンセル', style: 'cancel', onPress: close },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            easeListChange();
            deleteFolder(folder.id);
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  const row = (
    icon: 'inbox' | 'folder',
    name: string,
    count: number,
    isFirst: boolean,
    onPress: () => void
  ) => (
    // 半透明にすると裏の削除ボタンが透けるので、押した感じは背景色で出す
    <Pressable
      style={({ pressed }) => [styles.row, { backgroundColor: pressed ? colors.pressed : colors.surface }]}
      onPress={onPress}
    >
      {!isFirst && <View style={[styles.separator, { backgroundColor: colors.border }]} />}
      <Feather name={icon} size={21} color={colors.primary} />
      <Text style={[styles.rowName, { color: colors.text }]} numberOfLines={1}>
        {name}
      </Text>
      <Text style={[styles.rowCount, { color: colors.textSecondary }]}>{count}</Text>
      <Feather name="chevron-right" size={18} color={colors.textSecondary} />
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>あいろく</Text>
        <TouchableOpacity
          style={[styles.search, { backgroundColor: colors.fieldBackground }]}
          onPress={() => router.push('/search')}
          activeOpacity={0.7}
        >
          <Feather name="search" size={17} color={colors.textSecondary} />
          <Text style={[styles.searchText, { color: colors.textSecondary }]}>検索</Text>
        </TouchableOpacity>

        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          {row('inbox', 'すべての回答', conversations.length, true, () => router.push('/folder/all'))}
          {sortedFolders.map((f) => (
            <SwipeToDelete key={f.id} onDelete={(close) => handleDelete(f, close)}>
              {row('folder', f.name, countOf(f.id), false, () => router.push(`/folder/${f.id}`))}
            </SwipeToDelete>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.toolbar, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={styles.addFolder}
          onPress={() => setModalVisible(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="folder-plus" size={20} color={colors.primary} />
          <Text style={[styles.addFolderText, { color: colors.primary }]}>フォルダを追加</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/conversation/[id]', params: { id: 'new' } })}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="回答を保存"
        >
          <Feather name="edit" size={23} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FolderNameModal
        visible={modalVisible}
        title="新しいフォルダ"
        submitLabel="作成"
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    marginTop: 12,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 38,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  searchText: {
    fontSize: 16,
  },
  group: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  separator: {
    position: 'absolute',
    top: 0,
    left: 47,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  rowName: {
    flex: 1,
    fontSize: 17,
  },
  rowCount: {
    fontSize: 16,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  addFolder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addFolderText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
