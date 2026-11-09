import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore
import { Feather } from '@expo/vector-icons';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../hooks/useTheme';
import { FolderNameModal } from '../components/FolderNameModal';
import { SwipeToDelete } from '../components/SwipeToDelete';
import { Folder } from '../types';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { folders, conversations, addFolder, updateFolder, deleteFolder, isLoading } = useData();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);

  const countOf = (folderId: string) => conversations.filter((c) => c.folderId === folderId).length;
  const sortedFolders = [...folders].sort((a, b) => b.createdAt - a.createdAt);

  const closeModal = () => {
    setModalVisible(false);
    setEditingFolder(null);
  };

  const handleSubmit = async (name: string) => {
    if (editingFolder) {
      await updateFolder(editingFolder.id, name);
    } else {
      await addFolder(name);
    }
    closeModal();
  };

  const handleDelete = (folder: Folder, close?: () => void) => {
    const count = countOf(folder.id);
    Alert.alert(
      'フォルダを削除',
      `「${folder.name}」を削除しますか？${count > 0 ? `\n${count}件の回答も削除されます。` : ''}`,
      [
        { text: 'キャンセル', style: 'cancel', onPress: close },
        { text: '削除', style: 'destructive', onPress: () => deleteFolder(folder.id) },
      ]
    );
  };

  const handleMenu = (folder: Folder) => {
    Alert.alert(folder.name, '', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '名前を変更',
        onPress: () => {
          setEditingFolder(folder);
          setModalVisible(true);
        },
      },
      { text: '削除', style: 'destructive', onPress: () => handleDelete(folder) },
    ]);
  };

  if (isLoading) {
    return <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  const row = (
    icon: string,
    name: string,
    count: number,
    isFirst: boolean,
    onPress: () => void,
    onLongPress?: () => void
  ) => (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.surface }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.6}
    >
      {!isFirst && <View style={[styles.separator, { backgroundColor: colors.border }]} />}
      <Feather name={icon} size={21} color={colors.primary} />
      <Text style={[styles.rowName, { color: colors.text }]} numberOfLines={1}>
        {name}
      </Text>
      <Text style={[styles.rowCount, { color: colors.textSecondary }]}>{count}</Text>
      <Feather name="chevron-right" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
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
              {row('folder', f.name, countOf(f.id), false, () => router.push(`/folder/${f.id}`), () => handleMenu(f))}
            </SwipeToDelete>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.toolbar, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={styles.addFolder}
          onPress={() => {
            setEditingFolder(null);
            setModalVisible(true);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="folder-plus" size={20} color={colors.primary} />
          <Text style={[styles.addFolderText, { color: colors.primary }]}>フォルダを追加</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/conversation/new')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="回答を保存"
        >
          <Feather name="edit" size={23} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FolderNameModal
        visible={modalVisible}
        title={editingFolder ? 'フォルダ名を変更' : '新しいフォルダ'}
        submitLabel={editingFolder ? '変更' : '作成'}
        initialName={editingFolder?.name ?? ''}
        onCancel={closeModal}
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
