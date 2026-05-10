import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Folder } from '../types';

const FOLDER_COLORS = [
  '#007AFF', '#34C759', '#FF9500', '#AF52DE',
  '#FF3B30', '#5AC8FA', '#FF2D55', '#5856D6',
  '#00C7BE', '#FFCC00',
];

const getFolderColor = (id: string): string => {
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return FOLDER_COLORS[hash % FOLDER_COLORS.length];
};

interface FolderCardProps {
  folder: Folder;
  conversationCount: number;
  onPress: () => void;
  onLongPress: () => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  conversationCount,
  onPress,
  onLongPress,
}) => {
  const { colors } = useTheme();
  const folderColor = getFolderColor(folder.id);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={[styles.colorBar, { backgroundColor: folderColor }]} />
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {folder.name}
        </Text>
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {conversationCount}件の会話
        </Text>
      </View>
      <Text style={[styles.arrow, { color: colors.textSecondary }]}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  colorBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  count: {
    fontSize: 14,
  },
  arrow: {
    fontSize: 24,
    fontWeight: '300',
    paddingRight: 16,
  },
});

