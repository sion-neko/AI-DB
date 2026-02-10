import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../hooks/useTheme';
import { FolderCard } from '../components/FolderCard';
import { Folder } from '../types';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { folders, conversations, addFolder, updateFolder, deleteFolder, isLoading } = useData();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderName, setFolderName] = useState('');

  const getConversationCount = (folderId: string): number => {
    return conversations.filter((c) => c.folderId === folderId).length;
  };

  const handleAddFolder = () => {
    setEditingFolder(null);
    setFolderName('');
    setModalVisible(true);
  };

  const handleEditFolder = (folder: Folder) => {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setModalVisible(true);
  };

  const handleSaveFolder = async () => {
    if (!folderName.trim()) return;

    if (editingFolder) {
      await updateFolder(editingFolder.id, folderName.trim());
    } else {
      await addFolder(folderName.trim());
    }
    setModalVisible(false);
    setFolderName('');
    setEditingFolder(null);
  };

  const handleDeleteFolder = (folder: Folder) => {
    const count = getConversationCount(folder.id);
    Alert.alert(
      'フォルダを削除',
      `「${folder.name}」を削除しますか？${count > 0 ? `\n${count}件の会話も削除されます。` : ''}`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => deleteFolder(folder.id),
        },
      ]
    );
  };

  const handleFolderLongPress = (folder: Folder) => {
    Alert.alert(folder.name, '', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '編集', onPress: () => handleEditFolder(folder) },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => handleDeleteFolder(folder),
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loading}>
          <Text style={{ color: colors.textSecondary }}>読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA' }]}
          onPress={() => router.push('/search')}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>
            会話を検索
          </Text>
        </TouchableOpacity>
      </View>

      {folders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            フォルダがありません
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            右上の＋ボタンでフォルダを作成してください
          </Text>
        </View>
      ) : (
        <FlatList
          data={folders.sort((a, b) => b.createdAt - a.createdAt)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FolderCard
              folder={item}
              conversationCount={getConversationCount(item.id)}
              onPress={() => router.push(`/folder/${item.id}`)}
              onLongPress={() => handleFolderLongPress(item)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleAddFolder}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editingFolder ? 'フォルダを編集' : '新しいフォルダ'}
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                  color: colors.text,
                },
              ]}
              value={folderName}
              onChangeText={setFolderName}
              placeholder="フォルダ名"
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={() => {
                  setModalVisible(false);
                  setFolderName('');
                  setEditingFolder(null);
                }}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.primary, opacity: folderName.trim() ? 1 : 0.5 },
                ]}
                onPress={handleSaveFolder}
                disabled={!folderName.trim()}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  {editingFolder ? '保存' : '作成'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 16,
  },
  list: {
    paddingVertical: 8,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
